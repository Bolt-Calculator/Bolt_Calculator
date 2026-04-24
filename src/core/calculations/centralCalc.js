export default function centralCalculations(
  userData,
  curBolt,
  curBoltProperty,
) {
  console.log('[centralCalc] Starting calculations...');
  console.log('[centralCalc] Input data:', {
    userData,
    boltDesignation: curBolt?.designation,
    propertyClass: curBoltProperty?.className,
  });

  try {
    // 1. caclulation phase 1: pre calculations

    userData = {
      youngsModulus: 21000,
      extLoadPerBolt: userData.externalLoad / userData.numberOfBolts,
      latLoadPerBolt: userData.lateralLoad / userData.numberOfBolts,
      ...userData,
    };

    console.log('[centralCalc] Running pre-calculations...');

    const preCalcResults = preCalculation(userData, curBolt, curBoltProperty);
    console.log('[centralCalc] Pre-calculations complete');

    console.log('[centralCalc] Running main calculations...');
    // 2. Main calculations
    const mainResults = mainCalculation(
      userData,
      curBolt,
      curBoltProperty,
      preCalcResults,
    );
    console.log('[centralCalc] Main calculations complete');

    const obtainedValues = {
      ...mainResults,
      preLoad: userData.preLoad, // TO BE CHANGED
    };

    console.log('[centralCalc] Running limit calculations...');
    const limitResults = limitCalculation(userData, curBolt, preCalcResults);
    console.log('[centralCalc] Calculations finished successfully');

    return { obtainedValues, limitResults };
  } catch (error) {
    console.error('[centralCalc] Error during calculations:', error);
    console.error('[centralCalc] Error stack:', error.stack);
    throw error;
  }
}

function limitCalculation(userData, curBolt, preCalcResults) {
  // 1. Tensile stress = ultimate tensile stress / Factor of safety
  const tensileStress =
    preCalcResults.ultimateTensileStrength / preCalcResults.factorOfSafety;

  // 2. Shear stress = (0.6 * yield strength) / factor of safety
  const shearStress =
    (0.6 * preCalcResults.yeildStrength) / preCalcResults.factorOfSafety;

  // 3. plate bearing stress = (yeild strength * bearing factor ) / factor of safety
  const plateBearingStress =
    (preCalcResults.yeildStrength * preCalcResults.bearingFactor) /
    preCalcResults.factorOfSafety;

  // 4. thread shear stress = shear stress
  const threadShearStress = shearStress;

  // 5. pre load = 0.7 * yeild strength * tensile stress area
  const preLoad =
    0.7 * preCalcResults.yeildStrength * curBolt.tensileStressArea;

  // 6. separation load
  const separationLoad = userData.extLoadPerBolt * 0.6;

  return {
    tensileStress,
    shearStress,
    plateBearingStress,
    threadShearStress,
    preLoad,
    separationLoad,
  };
}

function preCalculation(userData, curBolt, curBoltProperty) {
  /*

  1. Ultimate tensile strength = X * 100;
  2. Yeild strength = Ultimate tensile strength * Y 
  3. Factor of Safety = 2
  4. Bearing factor = 2
  5. Bolt tensile length = plate thickness + (0.5 * bolt diameter)
  */

  //1. Ultimate tensile strength
  const ultimateTensileStrength = curBoltProperty.xValue * 100;

  //2. Yeild strength
  const yeildStrength = ultimateTensileStrength * curBoltProperty.yValue;

  //3. Factor of Safety
  const factorOfSafety = 2;

  //4. Bearing factor
  const bearingFactor = 2;

  //5. Bolt tensile length
  const boltTensileLength =
    userData.plateThickness + 0.5 * curBolt.nominalDiameter;

  return {
    ultimateTensileStrength,
    yeildStrength,
    factorOfSafety,
    bearingFactor,
    boltTensileLength,
  };
}

function mainCalculation(userData, curBolt, curBoltProperty, preCalcResults) {
  /* 
  1. Tensile stress:
      F'b = preload + (0.06 + External load)
      tensileStress = F'b / tensile stress area
  */
  const forceTensile = userData.preLoad + 0.06 * userData.extLoadPerBolt;
  const tensileStress = forceTensile / curBolt.tensileStressArea;

  /* 
  2. Shear stress 
    shank area = (Pi / 4 ) * bolt diameter^2
    shear stress = external load / shank area 
  */
  const shankArea = (Math.PI / 4) * curBolt.nominalDiameter ** 2;
  const shearStress = userData.extLoadPerBolt / shankArea;

  /*
  3. Bearing stress on plate 
    stress = external load / (bolt diameter * plate thickness)
  */
  const plateBearingStress =
    userData.extLoadPerBolt /
    (curBolt.nominalDiameter * userData.plateThickness);

  /*
  4. Thread shear stress 
  stess = force tensile / (PI * thread mean diameter * engaged thread length)
  */
  const threadShearStress =
    forceTensile /
    (Math.PI * curBolt.threadMeanDiameter * userData.engagedThreadLength);

  /*
  5. Bolt stiffness 
    bolt stiffness = (tensile stress area * youngs modulus) / bolt tensile length
  */
  const boltStiffness =
    (curBolt.tensileStressArea * userData.youngsModulus) /
    preCalcResults.boltTensileLength;

  /*
  6. Bolt elongation 
    bolt elongation = force tensile / bolt stiffness
  */
  const boltElongation = forceTensile / boltStiffness;

  /*
  7. Flexural bending
    Inertia = (PI / 64) * bolt diameter ^ 4
    deformation = (lateral load * (bolt tensile length ** 3)) / (3 * youngs modulus * Inertia)
  */
  const inertiaBending = (Math.PI / 64) * curBolt.nominalDiameter ** 4;
  const deformation =
    (userData.latLoadPerBolt * preCalcResults.boltTensileLength ** 3) /
    (3 * userData.youngsModulus * inertiaBending);

  /*
  8. Member stiffness 
    contact area = PI * (1.5 * bolt diameter ) ** 2
    member stiffness = (contact area * young modulus ) / plate thickness 

  */
  const contactArea = Math.PI * (1.5 * curBolt.nominalDiameter) ** 2;
  const memberStiffness =
    (contactArea * userData.youngsModulus) / userData.plateThickness;

  /*
  9. Load distribution 
  load distrubution = bolt stiffness / (bolt stiffness + member stiffness )
  */
  const loadDistribution = boltStiffness / (boltStiffness + memberStiffness);

  /*
  10. Pre load
  bolt load = preload + load distribution 
  plate load = preload - ( 1 - load distribution) * external load
  */
  const boltLoad = userData.preLoad + loadDistribution;
  const plateLoad =
    userData.preLoad - (1 - loadDistribution) * userData.extLoadPerBolt;

  /*
  11. deflection under service load 
  plate compression = plate load / member stiffness
  total compression = bolt elongation + plate compression 
  */
  const plateCompression = plateLoad / memberStiffness;
  const totalCompression = boltElongation + plateCompression;

  /*
  12. Separation load 
  separation load = pre load / ( 1 - load distribution )
  */
  const separationLoad = userData.preLoad / (1 - loadDistribution);

  ////////////////////////////////////////////////

  return {
    tensileStress,
    shearStress,
    plateBearingStress,
    threadShearStress,
    separationLoad,
  };

  // return {
  //   threadShearStress,
  // };
}

// USER DATA
// {
//     plateThickness: 16,
//     externalLoad: 12000,
//     preLoad: 20000,
//     lateralLoad: 500,
//     engagedThreadLength: 8,
//     tensileStressArea: 58,
//     youngsModulus: 21000
//   }

// BOLT
// {
//   id: 1,
//   designation: 'M3',
//   nominalDiameter: 3,
//   threadMeanDiameter: 2.530690599,
//   tensileStressArea: 5.03,
//   createdAt: 2026-02-03T04:20:46.802Z
// }

// PROPERTY
// {
//   id: 1,
//   className: '4.6',
//   xValue: 4,
//   yValue: 0.6,
//   createdAt: 2026-02-03T04:20:48.717Z
// }

// FINAL obtained Values should be
// 1) TENSILE STRESS
// 2) SHEAR STRESS
// 3) BEARING STRESS ON PLATE
// 5) THREAD SHEAR STRESS
// 6) PRE LOAD
// 7) SEPERATION LOAD
