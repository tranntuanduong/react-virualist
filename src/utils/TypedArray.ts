interface Dictionary<T = any> {
  [key: string]: T;
}

class TypedArray {
  public key<T extends number | null, A extends Dictionary[]>(
    key: T,
    array: A
  ) {
    if (!key) return null;
    const isExists = array.some((item) => Object.values(item).includes(key));
    return isExists ? key : null;
  }
}

export default new TypedArray();
