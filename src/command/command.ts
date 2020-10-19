import * as vscode from 'vscode';
let COMMAND_BUFFER : {type : { new (...args: any[]) : ICommand<any> }, name : string}[] | undefined = [];

export interface ICommand<T> {
  context?: vscode.ExtensionContext;
  run(args? : T) : void;
}

/**
 * Command Decorator
 * @param name command name
 */
export const Command = (name : string) : Function => {
  return (target : { new (...args: any[]): ICommand<any> }) => {
    COMMAND_BUFFER?.push({
      type : target,
      name : name
    });
  };
};

// can be improved
const DisposeCommandBuffer = () : void => {
  COMMAND_BUFFER = undefined;
};

const LoadCommands = (context : vscode.ExtensionContext) : number => {
  let commandCount = 0;
  
  if (COMMAND_BUFFER === undefined) {
    throw new Error('Command Buffer Disposed');
  }

  COMMAND_BUFFER.forEach(commandMeta => {
    const command = new commandMeta.type();
    command.context = context;

    const disposable = vscode.commands.registerCommand(
      `extension.${commandMeta.name}`,
      command.run.bind(command)
    );
    context.subscriptions.push(disposable);
    
    commandCount++;
  });

  return commandCount;
};

/**
 * CommandManager Module
 */
export const CommandManager = {
  LoadCommands : LoadCommands,
  Dispose : DisposeCommandBuffer
};