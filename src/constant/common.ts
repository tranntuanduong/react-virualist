export interface IObject {
  [key: string | number]: any;
}

export const DATA_TYPE: IObject = {
  STRING: 'string',
  NUMBER: 'number',
  DATE_TIME: 'date',
  LOOKUP: 'lookup',
  BOOLEAN: 'boolean',
};

export const SORT_MODE: IObject = {
  0: false,
  1: 'asc',
  2: 'desc',
}

export const MODAL_TYPE = {
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete'
};

export const FILTER = {
  text: 'text',
  numeric: 'numeric',
  boolean: 'boolean',
  date: 'date',
  lookup: 'lookup',
};
