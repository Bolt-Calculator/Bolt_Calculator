import {
  TakeawayCallout,
  type TakeawayCalloutProps,
  TechnicalCallout,
  type TechnicalCalloutProps,
  WarningCallout,
  type WarningCalloutProps,
} from './index';
import type { CalloutVariant } from './types';

type CalloutBlockValue = {
  variant?: CalloutVariant;
  heading?: string;
  message?: string;
  reference?: string;
  formula?: string;
  variables?: TechnicalCalloutProps['variables'];
  actionLabel?: string;
  steps?: WarningCalloutProps['steps'];
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  stats?: TakeawayCalloutProps['stats'];
};

export function CalloutRenderer({ value }: { value?: CalloutBlockValue }) {
  if (!value?.message) return null;

  switch (value.variant) {
    case 'warning':
      return (
        <WarningCallout
          heading={value.heading}
          message={value.message}
          reference={value.reference}
          steps={value.steps}
          primaryActionLabel={value.primaryActionLabel}
          secondaryActionLabel={value.secondaryActionLabel}
        />
      );
    case 'takeaway':
      return (
        <TakeawayCallout
          heading={value.heading}
          message={value.message}
          reference={value.reference}
          stats={value.stats}
        />
      );
    case 'technical':
    default:
      return (
        <TechnicalCallout
          heading={value.heading}
          message={value.message}
          formula={value.formula}
          variables={value.variables}
        />
      );
  }
}
