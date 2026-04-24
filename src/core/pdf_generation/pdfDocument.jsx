import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#1978e5',
    paddingBottom: 16,
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  headerInfo: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 3,
  },
  headerLabel: {
    fontFamily: 'Helvetica-Bold',
    color: '#334155',
    width: 80,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  brandName: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  brandAccent: {
    color: '#1978e5',
  },
  brandSubtitle: {
    fontSize: 7,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#1978e5',
  },
  row: {
    flexDirection: 'row',
    gap: 24,
  },
  col: {
    flex: 1,
  },
  subsectionTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  table: {
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 6,
    marginBottom: 6,
  },
  tableHeaderCell: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#f1f5f9',
    paddingVertical: 6,
  },
  tableCell: {
    fontSize: 9,
    color: '#475569',
  },
  tableCellBold: {
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  boltBox: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  boltBoxRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  boltBoxCol: {
    flex: 1,
    paddingHorizontal: 8,
    borderLeftWidth: 1,
    borderLeftColor: '#e2e8f0',
  },
  boltBoxColFirst: {
    borderLeftWidth: 0,
  },
  boltBoxLabel: {
    fontSize: 7,
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  boltBoxValue: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  statusPass: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    padding: 4,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#bbf7d0',
  },
  statusFail: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    padding: 4,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#fecaca',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  disclaimer: {
    fontSize: 7,
    color: '#94a3b8',
    maxWidth: 400,
    lineHeight: 1.4,
  },
  pageNumber: {
    fontSize: 8,
    color: '#64748b',
    textAlign: 'right',
  },
  actionSection: {
    marginTop: 32,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  actionBox: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  actionDescription: {
    fontSize: 9,
    color: '#64748b',
  },
  actionButton: {
    backgroundColor: '#1978e5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    textDecoration: 'none',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

const PDFDocument = ({ data }) => {
  // Debug logging
  console.log('[PDFDocument] Received data:', {
    hasUserInputData: !!data?.userInputData,
    userInputDataKeys: data?.userInputData
      ? Object.keys(data.userInputData)
      : [],
    userInputData: data?.userInputData,
    hasCurBolt: !!data?.curBolt,
    hasCurBoltProperty: !!data?.curBoltProperty,
    hasObtainedValues: !!data?.obtainedValues,
    hasLimits: !!data?.limits,
  });

  const formatNumber = (value, digits = 2) => {
    if (value === null || value === undefined || isNaN(value)) return '-';
    return Number(value).toFixed(digits);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });
  };

  const buildReferenceId = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `BCP-${yyyy}${mm}${dd}-AUTO`;
  };

  const userData = data.userInputData || {};
  const curBolt = data.curBolt || {};
  const curBoltProperty = data.curBoltProperty || {};
  const obtained = data.obtainedValues || {};
  const limits = data.limits || {};

  const isPass = (value, limit) => {
    if (value == null || limit == null) return false;
    return Number(value) <= Number(limit);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Engineering Analysis Report</Text>
            <View style={{ marginTop: 8 }}>
              <View style={{ flexDirection: 'row', marginBottom: 2 }}>
                <Text style={styles.headerLabel}>DATE:</Text>
                <Text style={styles.headerInfo}>{formatDate(new Date())}</Text>
              </View>
              <View style={{ flexDirection: 'row', marginBottom: 2 }}>
                <Text style={styles.headerLabel}>REFERENCE ID:</Text>
                <Text style={styles.headerInfo}>{buildReferenceId()}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.headerLabel}>PROJECT:</Text>
                <Text style={styles.headerInfo}>Bolt Design Analysis</Text>
              </View>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.brandName}>
              Bolt<Text style={styles.brandAccent}>Calculator</Text>
            </Text>
            <Text style={styles.brandSubtitle}>ENGINEERING SUITE</Text>
          </View>
        </View>

        {/* Input Parameters Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Design Input Parameters</Text>
          <View style={styles.row}>
            {/* Left Column */}
            <View style={styles.col}>
              <Text style={styles.subsectionTitle}>Geometry & Load</Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <View style={{ flex: 2 }}>
                    <Text style={styles.tableHeaderCell}>Parameter</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={styles.tableHeaderCell}>Value</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={{ flex: 2 }}>
                    <Text style={styles.tableCell}>Number of Bolts</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={[styles.tableCell, styles.tableCellBold]}>
                      {formatNumber(userData?.numberOfBolts, 0)}
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={{ flex: 2 }}>
                    <Text style={styles.tableCell}>Plate Thickness</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={[styles.tableCell, styles.tableCellBold]}>
                      {formatNumber(userData?.plateThickness)} mm
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={{ flex: 2 }}>
                    <Text style={styles.tableCell}>Engaged Thread Length</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={[styles.tableCell, styles.tableCellBold]}>
                      {formatNumber(userData?.engagedThreadLength)} mm
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={{ flex: 2 }}>
                    <Text style={styles.tableCell}>External Load</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={[styles.tableCell, styles.tableCellBold]}>
                      {formatNumber(userData?.externalLoad, 0)} N
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={{ flex: 2 }}>
                    <Text style={styles.tableCell}>Preload</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={[styles.tableCell, styles.tableCellBold]}>
                      {formatNumber(userData?.preLoad, 0)} N
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={{ flex: 2 }}>
                    <Text style={styles.tableCell}>Lateral Load</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={[styles.tableCell, styles.tableCellBold]}>
                      {formatNumber(userData?.lateralLoad, 0)} N
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Right Column */}
            <View style={styles.col}>
              <Text style={styles.subsectionTitle}>Material Specification</Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <View style={{ flex: 2 }}>
                    <Text style={styles.tableHeaderCell}>Property</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={styles.tableHeaderCell}>Standard</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={{ flex: 2 }}>
                    <Text style={styles.tableCell}>
                      Young&apos;s Modulus (E)
                    </Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={[styles.tableCell, styles.tableCellBold]}>
                      21000 N/mm²
                    </Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={{ flex: 2 }}>
                    <Text style={styles.tableCell}>Safety Factor</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text style={[styles.tableCell, styles.tableCellBold]}>
                      2.0
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Results Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calculated Results</Text>

          {/* Bolt Specifications Box */}
          <View style={styles.boltBox}>
            <Text style={styles.subsectionTitle}>
              Selected Bolt Specifications
            </Text>
            <View style={styles.boltBoxRow}>
              <View style={[styles.boltBoxCol, styles.boltBoxColFirst]}>
                <Text style={styles.boltBoxLabel}>Bolt Size</Text>
                <Text style={styles.boltBoxValue}>
                  {curBolt?.designation || '-'}
                </Text>
              </View>
              <View style={styles.boltBoxCol}>
                <Text style={styles.boltBoxLabel}>Bolt Grade</Text>
                <Text style={styles.boltBoxValue}>
                  {curBoltProperty?.className || '-'}
                </Text>
              </View>
              <View style={styles.boltBoxCol}>
                <Text style={styles.boltBoxLabel}>Bolt Diameter</Text>
                <Text style={styles.boltBoxValue}>
                  {formatNumber(curBolt?.nominalDiameter)} mm
                </Text>
              </View>
              <View style={styles.boltBoxCol}>
                <Text style={styles.boltBoxLabel}>Tensile Stress Area</Text>
                <Text style={styles.boltBoxValue}>
                  {formatNumber(curBolt?.tensileStressArea, 1)} mm²
                </Text>
              </View>
            </View>
          </View>

          {/* Verification Table */}
          <Text style={[styles.subsectionTitle, { marginBottom: 8 }]}>
            Stress and Load Verification
          </Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <View style={{ flex: 3 }}>
                <Text style={styles.tableHeaderCell}>Parameter</Text>
              </View>
              <View style={{ flex: 1.5, alignItems: 'flex-end' }}>
                <Text style={styles.tableHeaderCell}>Nominal Value</Text>
              </View>
              <View style={{ flex: 1.5, alignItems: 'flex-end' }}>
                <Text style={styles.tableHeaderCell}>Allowable Limit</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={styles.tableHeaderCell}>Status</Text>
              </View>
            </View>

            {/* Tensile Stress */}
            <View style={styles.tableRow}>
              <View style={{ flex: 3 }}>
                <Text style={[styles.tableCell, styles.tableCellBold]}>
                  Tensile Stress
                </Text>
              </View>
              <View style={{ flex: 1.5, alignItems: 'flex-end' }}>
                <Text style={styles.tableCell}>
                  {formatNumber(obtained?.tensileStress)} MPa
                </Text>
              </View>
              <View style={{ flex: 1.5, alignItems: 'flex-end' }}>
                <Text style={styles.tableCell}>
                  {formatNumber(limits?.tensileStress)} MPa
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text
                  style={
                    isPass(obtained?.tensileStress, limits?.tensileStress)
                      ? styles.statusPass
                      : styles.statusFail
                  }
                >
                  {isPass(obtained?.tensileStress, limits?.tensileStress)
                    ? 'PASS'
                    : 'FAIL'}
                </Text>
              </View>
            </View>

            {/* Shear Stress */}
            <View style={styles.tableRow}>
              <View style={{ flex: 3 }}>
                <Text style={[styles.tableCell, styles.tableCellBold]}>
                  Shear Stress
                </Text>
              </View>
              <View style={{ flex: 1.5, alignItems: 'flex-end' }}>
                <Text style={styles.tableCell}>
                  {formatNumber(obtained?.shearStress)} MPa
                </Text>
              </View>
              <View style={{ flex: 1.5, alignItems: 'flex-end' }}>
                <Text style={styles.tableCell}>
                  {formatNumber(limits?.shearStress)} MPa
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text
                  style={
                    isPass(obtained?.shearStress, limits?.shearStress)
                      ? styles.statusPass
                      : styles.statusFail
                  }
                >
                  {isPass(obtained?.shearStress, limits?.shearStress)
                    ? 'PASS'
                    : 'FAIL'}
                </Text>
              </View>
            </View>

            {/* Bearing Stress */}
            <View style={styles.tableRow}>
              <View style={{ flex: 3 }}>
                <Text style={[styles.tableCell, styles.tableCellBold]}>
                  Bearing Stress
                </Text>
              </View>
              <View style={{ flex: 1.5, alignItems: 'flex-end' }}>
                <Text style={styles.tableCell}>
                  {formatNumber(obtained?.plateBearingStress)} MPa
                </Text>
              </View>
              <View style={{ flex: 1.5, alignItems: 'flex-end' }}>
                <Text style={styles.tableCell}>
                  {formatNumber(limits?.plateBearingStress)} MPa
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text
                  style={
                    isPass(
                      obtained?.plateBearingStress,
                      limits?.plateBearingStress,
                    )
                      ? styles.statusPass
                      : styles.statusFail
                  }
                >
                  {isPass(
                    obtained?.plateBearingStress,
                    limits?.plateBearingStress,
                  )
                    ? 'PASS'
                    : 'FAIL'}
                </Text>
              </View>
            </View>

            {/* Thread Shear Stress */}
            <View style={styles.tableRow}>
              <View style={{ flex: 3 }}>
                <Text style={[styles.tableCell, styles.tableCellBold]}>
                  Thread Shear Stress
                </Text>
              </View>
              <View style={{ flex: 1.5, alignItems: 'flex-end' }}>
                <Text style={styles.tableCell}>
                  {formatNumber(obtained?.threadShearStress)} MPa
                </Text>
              </View>
              <View style={{ flex: 1.5, alignItems: 'flex-end' }}>
                <Text style={styles.tableCell}>
                  {formatNumber(limits?.threadShearStress)} MPa
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text
                  style={
                    isPass(
                      obtained?.threadShearStress,
                      limits?.threadShearStress,
                    )
                      ? styles.statusPass
                      : styles.statusFail
                  }
                >
                  {isPass(
                    obtained?.threadShearStress,
                    limits?.threadShearStress,
                  )
                    ? 'PASS'
                    : 'FAIL'}
                </Text>
              </View>
            </View>

            {/* Preload */}
            <View style={styles.tableRow}>
              <View style={{ flex: 3 }}>
                <Text style={[styles.tableCell, styles.tableCellBold]}>
                  Preload Stress
                </Text>
              </View>
              <View style={{ flex: 1.5, alignItems: 'flex-end' }}>
                <Text style={styles.tableCell}>
                  {formatNumber(obtained?.preLoad)} N
                </Text>
              </View>
              <View style={{ flex: 1.5, alignItems: 'flex-end' }}>
                <Text style={styles.tableCell}>
                  {formatNumber(limits?.preLoad)} N
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text
                  style={
                    isPass(obtained?.preLoad, limits?.preLoad)
                      ? styles.statusPass
                      : styles.statusFail
                  }
                >
                  {isPass(obtained?.preLoad, limits?.preLoad) ? 'PASS' : 'FAIL'}
                </Text>
              </View>
            </View>

            {/* Separation Load */}
            <View style={styles.tableRow}>
              <View style={{ flex: 3 }}>
                <Text style={[styles.tableCell, styles.tableCellBold]}>
                  Separation Load
                </Text>
              </View>
              <View style={{ flex: 1.5, alignItems: 'flex-end' }}>
                <Text style={styles.tableCell}>
                  {formatNumber(obtained?.separationLoad)} N
                </Text>
              </View>
              <View style={{ flex: 1.5, alignItems: 'flex-end' }}>
                <Text style={styles.tableCell}>
                  {formatNumber(limits?.separationLoad)} N (Min)
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text
                  style={
                    isPass(limits?.separationLoad, obtained?.separationLoad)
                      ? styles.statusPass
                      : styles.statusFail
                  }
                >
                  {isPass(limits?.separationLoad, obtained?.separationLoad)
                    ? 'PASS'
                    : 'FAIL'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Section */}
        <View style={styles.actionSection}>
          <View style={styles.actionBox}>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Recalculate</Text>
              <Text style={styles.actionDescription}>
                Want to calculate again? Visit Bolt Calculator
              </Text>
            </View>
            <Link
              src="https://bolt-calculator.vercel.app/input"
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>Go to Calculator</Text>
            </Link>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.disclaimer}>
            Disclaimer: This report is generated by BoltCalculator and is
            intended for engineering reference only. Final design decisions
            should be verified by a licensed professional engineer according to
            regional standards (ASME/ISO/Eurocode). Calculated safety factor is
            2.0 (Yield basis).
          </Text>
          <View>
            <Text style={styles.pageNumber}>Page 1 of 1</Text>
            <Text style={[styles.disclaimer, { marginTop: 2 }]}>
              Generated by BoltCalculator Engineering Suite
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PDFDocument;
