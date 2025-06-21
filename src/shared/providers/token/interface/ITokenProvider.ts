import { SingInput, SingOutput } from '@/shared/providers/token/types/sing';
import {
  DecodeInput,
  DecodeOutput,
} from '@/shared/providers/token/types/decode';

export abstract class ITokenProvider {
  abstract sign(data: SingInput): Promise<SingOutput>;
  abstract decode(data: DecodeInput): Promise<DecodeOutput>;
}
