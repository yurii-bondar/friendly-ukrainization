import { Gender } from '../../types.js';

/**
 * Given names whose ending would otherwise be misread by the common-noun
 * heuristics — masculine names spelled with the 1st-declension -а/-я
 * ending (Микола, Ілля), which still decline through the regular 1st
 * declension but must be tagged masculine so accusative/animacy defaults
 * are right.
 */
export const GIVEN_NAME_GENDER_HINTS: Record<string, Gender> = {
  микола: Gender.MASCULINE,
  ілля: Gender.MASCULINE,
  сава: Gender.MASCULINE,
  лука: Gender.MASCULINE,
  кузьма: Gender.MASCULINE,
  хома: Gender.MASCULINE,
  тома: Gender.MASCULINE,
  йона: Gender.MASCULINE,
  никита: Gender.MASCULINE,
};
