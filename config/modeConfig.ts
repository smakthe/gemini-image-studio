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
    placeholder: "e.g., 'A majestic lion wearing an ornate crown, oil painting style'",
    examples: GENERATE_EXAMPLES,
  },
  [AppMode.EDIT]: {
    title: "2. Describe Your Vision",
    placeholder: "e.g., 'Apply a 1970s faded film look with high grain' or 'Change the background to a neon-lit Tokyo street'",
    examples: EDIT_EXAMPLES,
  },
  [AppMode.TIME_TRAVEL]: {
    title: "2. Describe Your Vision",
    placeholder: "e.g., 'A 1920s jazz singer on a smoky stage, wearing a sequined dress' or 'An astronaut on a Mars-like planet'",
    examples: TIME_TRAVEL_EXAMPLES,
  },
};
