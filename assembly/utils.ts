export function genUUID(length: i32 = 32): string {
  let uuid = '';
  while (uuid.length !== length) {
    let randomDigit = Mathf.random().toString().substr(2);
    if (uuid.length < length) uuid = uuid + randomDigit;
    if (uuid.length > length) uuid = uuid.substr(0, length);
  }
  return uuid;
}
