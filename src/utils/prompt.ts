import readline from 'readline';

export function promptText(question: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

export function promptHidden(question: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(question);

    const wasRaw = process.stdin.isRaw ?? false;
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf-8');

    let result = '';

    const onData = (data: string) => {
      const ch = data.toString();

      if (ch === '\r' || ch === '\n' || ch === '\u0004') {
        process.stdout.write('\n');
        process.stdin.setRawMode(wasRaw);
        process.stdin.pause();
        process.stdin.removeListener('data', onData);
        resolve(result);
        return;
      }

      if (ch === '\u007f' || ch === '\b') {
        if (result.length > 0) {
          result = result.slice(0, -1);
          process.stdout.write('\b \b');
        }
        return;
      }

      result += ch;
      process.stdout.write('*');
    };

    process.stdin.on('data', onData);
  });
}
