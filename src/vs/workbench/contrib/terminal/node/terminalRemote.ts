/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from 'vs/nls';
import { Registry } from 'vs/platform/registry/common/platform';
import { Extensions as ActionExtensions, IWorkbenchActionRegistry } from 'vs/workbench/common/actions';
import { SyncActionDescriptor } from 'vs/platform/actions/common/actions';
import { TERMINAL_ACTION_CATEGORY, ITerminalService } from 'vs/workbench/contrib/terminal/common/terminal';
import { TERMINAL_COMMAND_ID } from 'vs/workbench/contrib/terminal/common/terminalCommands';
import { Action } from 'vs/base/common/actions';
import { URI } from 'vs/base/common/uri';
import { homedir } from 'os';

export function registerRemoteContributions() {
	const actionRegistry = Registry.as<IWorkbenchActionRegistry>(ActionExtensions.WorkbenchActions);
	actionRegistry.registerWorkbenchAction(new SyncActionDescriptor(CreateNewLocalTerminalAction, CreateNewLocalTerminalAction.ID, CreateNewLocalTerminalAction.LABEL), 'Terminal: Create New Integrated Terminal (Local)', TERMINAL_ACTION_CATEGORY);
}

export class CreateNewLocalTerminalAction extends Action {
	public static readonly ID = TERMINAL_COMMAND_ID.NEW_LOCAL;
	public static readonly LABEL = nls.localize('workbench.action.terminal.newLocal', "Create New Integrated Terminal (Local)");

	constructor(
		id: string, label: string,
		@ITerminalService private readonly terminalService: ITerminalService
	) {
		super(id, label);
	}

	public run(event?: any): Promise<any> {
		const instance = this.terminalService.createTerminal({ cwd: URI.file(homedir()) });
		if (!instance) {
			return Promise.resolve(undefined);
		}
		this.terminalService.setActiveInstance(instance);
		return this.terminalService.showPanel(true);
	}
}
