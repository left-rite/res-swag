export const lcsRight = (sequence: string, subject: string): string => {
  for (let i=0; i<sequence.length; i++) {
    const seq = sequence.slice(i);
    if (subject.match(seq)) {
      return seq;
    }
  }
  return '';
};