import { AppMode, ModeConfig } from '../types';
import EDIT_EXAMPLES from '../EDIT_EXAMPLES';
import TIME_TRAVEL_EXAMPLES from '../TIME_TRAVEL_EXAMPLES';
import GENERATE_EXAMPLES from '../GENERATE_EXAMPLES';

type ModeConfigs = {
  [key in AppMode]: ModeConfig;
};

export const modeConfigs: ModeConfigs = {
  [AppMode.GENERATE]: {
    title: "1. Describe Your Vision",
    placeholder: "e.g., 'A robot holding a red skateboard.'",
    examples: GENERATE_EXAMPLES,
  },
  [AppMode.EDIT]: {
    title: "2. Describe Your Vision",
    placeholder: "e.g., 'Add a retro filter' or 'Make the background a cityscape at night.'",
    examples: EDIT_EXAMPLES,
  },
  [AppMode.TIME_TRAVEL]: {
    title: "2. Describe Your Vision",
    placeholder: "e.g., 'A 1920s jazz singer on stage' or 'An astronaut on Mars'.",
    examples: TIME_TRAVEL_EXAMPLES,
  },
};
