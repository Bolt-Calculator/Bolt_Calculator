'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import InfoTooltip from './InfoTooltip';

// 1. Define your form schema using Zod
// Use z.coerce.number to accept numeric input from text fields
const formSchema = z.object({
  numberOfBolts: z.coerce.number().int().positive({
    message: 'Number of bolts must be a positive whole number.',
  }),
  plateThickness: z.coerce.number().positive({
    message: 'Plate thickness must be a positive number.',
  }),
  externalLoad: z.coerce.number().nonnegative({
    message: 'External load must be zero or positive.',
  }),
  preLoad: z.coerce.number().nonnegative({
    message: 'Pre load must be zero or positive.',
  }),
  lateralLoad: z.coerce.number().nonnegative({
    message: 'Lateral load must be zero or positive.',
  }),
  engagedThreadLength: z.coerce.number().positive({
    message: 'Engaged thread length must be a positive number.',
  }),
  // tensileStressArea: z.coerce.number().positive({
  //   message: 'Tensile stress area must be a positive number.',
  // }),
  // youngsModulus: z.coerce.number().positive({
  //   message: "Young's modulus must be a positive number.",
  // }),
});

export function ProfileForm({ onSubmitForm }) {
  // 2. Initialize the form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numberOfBolts: '',
      plateThickness: '',
      externalLoad: '',
      preLoad: '',
      lateralLoad: '',
      engagedThreadLength: '',
      // tensileStressArea: '',
      // youngsModulus: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = form;

  // 3. Define a submit handler
  function onSubmit(values, e) {
    e?.preventDefault();
    // In JS, 'values' is just a plain object
    console.log(values);
    onSubmitForm(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-bg-form space-y-6 sm:space-y-8 border-2 rounded-md w-full max-w-full sm:max-w-150 lg:max-w-175 px-4 sm:px-8 md:px-12 lg:px-20 py-6 sm:py-8 lg:py-10"
      >
        {/* Number of bolts */}
        <FormField
          control={control}
          name="numberOfBolts"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Number of bolts</FormLabel>
                <InfoTooltip>
                  <p>Total number of bolts sharing the joint load.</p>
                  <p>This value is forwarded to the backend for processing.</p>
                </InfoTooltip>
              </div>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 4"
                  {...field}
                />
              </FormControl>
              <FormDescription>Whole number greater than zero</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator className="bg-gray-300" />

        {/* Plate thickness */}
        <FormField
          control={control}
          name="plateThickness"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Plate thickness</FormLabel>
                <InfoTooltip>
                  <p>
                    Thickness of the clamped member stack contributing to joint
                    stiffness.
                  </p>
                  <p>
                    Used for calculating member stiffness and load distribution
                    between bolt and plates.
                  </p>
                  <p>Use effective grip length, not nominal plate size.</p>
                </InfoTooltip>
              </div>
              <FormControl>
                <Input type="number" placeholder="e.g. 10" {...field} />
              </FormControl>
              <FormDescription>In millimeters (mm)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator className="bg-gray-300" />

        <div className="flex flex-col gap-3 space-y-3">
          {/* External load */}
          <FormField
            control={control}
            name="externalLoad"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>External load</FormLabel>
                  <InfoTooltip>
                    <p>
                      Axial service load applied to the joint after tightening.
                    </p>
                    <p>Assumed to act in tension unless stated otherwise.</p>
                    <p>
                      Used to compute additional bolt load based on joint
                      stiffness ratio.
                    </p>
                  </InfoTooltip>
                </div>
                <FormControl>
                  <Input type="number" placeholder="e.g. 5000" {...field} />
                </FormControl>
                <FormDescription>In Newtons (N)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pre load */}
          <FormField
            control={control}
            name="preLoad"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Pre load</FormLabel>
                  <InfoTooltip>
                    <p>
                      Initial tensile force induced in the bolt during
                      tightening.
                    </p>
                    <p>
                      Typically derived from torque–tension relation or
                      recommended preload percentage of proof load.
                    </p>
                    <p>Critical for joint separation and fatigue checks.</p>
                  </InfoTooltip>
                </div>

                <FormControl>
                  <Input type="number" placeholder="e.g. 8000" {...field} />
                </FormControl>
                <FormDescription>In Newtons (N)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Lateral load */}
          <FormField
            control={control}
            name="lateralLoad"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Lateral load</FormLabel>
                  <InfoTooltip>
                    <p>
                      Transverse shear load acting parallel to the joint
                      interface.
                    </p>
                    <p>
                      Used for slip, bearing, or shear failure checks depending
                      on joint type (friction-grip or bearing-type).
                    </p>
                    <p>Assumed uniformly distributed unless specified.</p>
                  </InfoTooltip>
                </div>
                <FormControl>
                  <Input type="number" placeholder="e.g. 2000" {...field} />
                </FormControl>
                <FormDescription>In Newtons (N)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator className="bg-gray-300" />

        <div className="flex flex-col gap-3">
          {/* Engaged Thread Length (L'e) */}
          <FormField
            control={control}
            name="engagedThreadLength"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Engaged Thread Length (L&apos;e)</FormLabel>
                  <InfoTooltip>
                    <p>
                      Effective length of threads engaged in the nut or tapped
                      hole.
                    </p>
                    <p>Used for thread stripping and load-sharing checks.</p>
                    <p>Excludes run-out and incomplete threads.</p>
                  </InfoTooltip>
                </div>
                <FormControl>
                  <Input type="number" placeholder="e.g. 12" {...field} />
                </FormControl>
                <FormDescription>In millimeters (mm)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tensile Stress Area (A't) */}
          {/* <FormField
            control={control}
            name="tensileStressArea"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Tensile Stress Area (A&apos;t)</FormLabel>
                  <InfoTooltip>
                    <p>
                      Effective cross-sectional area resisting axial tensile
                      load.
                    </p>
                    <p>Based on thread geometry (not nominal shank area).</p>
                    <p>
                      Used for stress, proof load, and fatigue calculations.
                    </p>
                  </InfoTooltip>
                </div>
                <FormControl>
                  <Input type="number" placeholder="e.g. 58" {...field} />
                </FormControl>
                <FormDescription>In millimeters² (mm²)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* Young's Modulus */}
          {/* <FormField
            control={control}
            name="youngsModulus"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Young&apos;s Modulus</FormLabel>
                  <InfoTooltip>
                    <p>Elastic modulus of bolt material. </p>
                    <p>
                      Used for bolt stiffness calculation and load-sharing with
                      clamped members.
                    </p>{' '}
                    <p>
                      {' '}
                      Ensure units are consistent with stress and geometry
                      inputs.
                    </p>
                  </InfoTooltip>
                </div>
                <FormControl>
                  <Input type="number" placeholder="e.g. 210000" {...field} />
                </FormControl>
                <FormDescription>
                  In Newton/millimeters² (N/mm²)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 justify-center">
          <Button
            className="font-roboto text-base w-full sm:w-auto"
            type="submit"
            variant="default"
            size="lg"
          >
            Calculate
          </Button>
          <Button
            className="font-roboto text-base w-full sm:w-auto"
            type="reset"
            variant="destructive"
            size="lg"
          >
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}
