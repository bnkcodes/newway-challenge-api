import { v4 as uuidv4 } from 'uuid';

import { ErrorCode } from '@/shared/infra/error/error-code';
import { ErrorException } from '@/shared/infra/error/error-exception';

export abstract class Entity<Props = any> {
  public readonly _id: string;
  public readonly props: Props;

  constructor(props: Props, id?: string) {
    this.props = props;
    this._id = id ?? uuidv4();
  }

  get id() {
    return this._id;
  }

  toJSON(): Required<{ id: string } & Props> {
    return {
      id: this._id,
      ...this.props,
    } as Required<{ id: string } & Props>;
  }

  static _validate(
    data: unknown,
    validate: (data: unknown) => Record<string, any>,
  ): void {
    const errors = validate(data);

    if (errors) {
      throw new ErrorException(
        ErrorCode.ValidationError,
        JSON.stringify(errors),
      );
    }
  }
}
