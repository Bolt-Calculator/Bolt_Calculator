import { z } from 'zod';

/* -----------------------------
   curBolt
------------------------------*/
const curBoltSchema = z
  .object({
    id: z.number().int().positive(),
    designation: z.string().min(1),
    nominalDiameter: z.number().positive(),
    threadMeanDiameter: z.number().positive(),
    tensileStressArea: z.number().positive(),
    createdAt: z.string().datetime(),
  })
  .strict();

/* -----------------------------
   curBoltProperty
------------------------------*/
const curBoltPropertySchema = z
  .object({
    id: z.number().int().positive(),
    className: z.string().min(1),
    xValue: z.number().positive(),
    yValue: z.number().positive(),
    createdAt: z.string().datetime(),
  })
  .strict();

/* -----------------------------
   limits
------------------------------*/
const limitsSchema = z
  .object({
    tensileStress: z.number().positive(),
    shearStress: z.number().positive(),
    plateBearingStress: z.number().positive(),
    threadShearStress: z.number().positive(),
    preLoad: z.number().nonnegative(),
    separationLoad: z.number().nonnegative(),
  })
  .strict();

/* -----------------------------
   obtainedValues
------------------------------*/
const obtainedValuesSchema = z
  .object({
    tensileStress: z.number(),
    shearStress: z.number(),
    plateBearingStress: z.number(),
    threadShearStress: z.number(),
    preLoad: z.number(),
    separationLoad: z.number(),
  })
  .strict();

/* -----------------------------
   userInputData
------------------------------*/
const userInputDataSchema = z
  .object({
    numberOfBolts: z.number().int().positive().optional(),
    plateThickness: z.number().positive(),
    engagedThreadLength: z.number().positive(),
    externalLoad: z.number().nonnegative(),
    preLoad: z.number().nonnegative(),
    lateralLoad: z.number().nonnegative(),
    calculatedAt: z.number().int(),
  })
  .strict();

/* -----------------------------
   Final PDF Body Schema
------------------------------*/
export const pdfSchema = z
  .object({
    curBolt: curBoltSchema,
    curBoltProperty: curBoltPropertySchema,
    limits: limitsSchema,
    obtainedValues: obtainedValuesSchema,
    userInputData: userInputDataSchema,
  })
  .strict();
