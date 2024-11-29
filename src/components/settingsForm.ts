import { stringifySeconds } from '../utilities/timeUtilities';

import {
	groupStartTypeTypes,
	operationModes,
	pauseBetweenSelectorTypes,
	practiceLengthTimes,
} from '../components/parameters';

export class SettingsForm {
	/**
	 * Creates an instance of SettingsForm.
	 *
	 * @constructor
	 * @param {groupStartTypeTypes} groupStartType
	 * @param {string} groupStartTimeStr
	 * @param {practiceLengthTimes} practiceLength
	 * @param {pauseBetweenSelectorTypes} pauseBetweenSelector
	 * @param {number} pauseLength
	 * @param {operationModes} operationMode
	 * @param {number} numberTeams
	 * @param {string[]} teamList
	 * @param {boolean} demo
	 */
	constructor(
		public groupStartType: groupStartTypeTypes,
		public groupStartTimeStr: string,
		public practiceLength: practiceLengthTimes,
		public pauseBetweenSelector: pauseBetweenSelectorTypes,
		public pauseLength: number,
		public operationMode: operationModes,
		public numberTeams: number,
		public teamList: string[],
		public demo: boolean
	) {
		const settingsForm: string = `
		<sl-drawer label="Settings" id="settings" style="--size: max-content" open>
			<form id="settings-form">
				<fieldset id="start">
					<sl-radio-group id="start-type"
						name="start-type" class="label-on-left"
						label="Group start mode" value="${this.groupStartType}">
						<sl-tooltip content="Start at designated Start Time">
							<sl-radio-button value="scheduled" pill>Scheduled</sl-radio-button>
						</sl-tooltip>
						<sl-tooltip content="Start when Current Team start button clicked">
							<sl-radio-button value="manual" pill>Manual</sl-radio-button>
						</sl-tooltip>
					</sl-radio-group>

					<sl-tooltip content='"eg: 10:45 AM"' distance=-20>
						<sl-input id="start-time" name="start-time" class="label-on-left"
							label="Start Time" type="time" value="${this.groupStartTimeStr}" autofocus
							required></sl-input>
					</sl-tooltip>
					<sl-tooltip content="See schedule or 104" distance=-20>
						<sl-select id="practice-length" name="practice-length"
							class="label-on-left" label="Practice Length"
							value="${this.practiceLength.toString()}"
							required>
							${this.demo ? '<sl-option value="2">2 minutes</sl-option>' : ''}
							<sl-option value="6">6 minutes</sl-option>
							<sl-option value="7">7 minutes</sl-option>
							<sl-option value="8">8 minutes</sl-option>
							<sl-option value="10">10 minutes</sl-option>
							<sl-option value="11">11 minutes</sl-option>
							<sl-option value="12">12 minutes</sl-option>
						</sl-select>
					</sl-tooltip>
				</fieldset>

				<fieldset id="timing">
					<sl-radio-group id="pause-between-selector"
						name="pause-between-selector" class="label-on-left"
						label="Pause between teams"
						value="${this.pauseBetweenSelector}">
						<sl-radio-button value="no" pill>No</sl-radio-button>
						<sl-radio-button value="yes" pill>Yes</sl-radio-button>
					</sl-radio-group>
					<sl-tooltip content="<minutes>:<seconds>" distance=-20>
						<sl-input id="pause-length" name="pause-length" class="label-on-left"
							label="Pause Length" disabled 						placeholder="00:00"
							value="${stringifySeconds(this.pauseLength, false, 'colon')}"></sl-input>
					</sl-tooltip>
				</fieldset>

				<fieldset id="operation-mode">
					<sl-radio-group id="operation-mode-selector"
					name="operation-mode-selector" class="label-on-left"
					label="Select operation mode" value="${this.operationMode}" required>
						<sl-tooltip content="Group based on Number of teams only">
								<sl-radio-button id="anonymous-mode" name="anonymous-mode" value="anonymous" pill>
									Anonymous
								</sl-radio-button>
						</sl-tooltip>
						<sl-tooltip content="Supply list of teams below">
								<sl-radio-button id="team-list-mode" name="team-list-mode" value="list" pill>
									Team List
								</sl-radio-button>
						</sl-tooltip>
					</sl-radio-group>
					<sl-tooltip content="Number of teams in this group" distance=-20>
						<sl-input id="number-teams" name="number-teams"
							class="label-on-left" label="Number of teams"
							type="number"
							min="1" step="1" value="${this.numberTeams.toString()}" required></sl-input>
					</sl-tooltip>
					<sl-textarea id="team-list" name="team-list"
						class="label-on-left" label="Team List" value="${this.teamList}" disabled
						help-text="Names of the teams in this group. One team per line (copy/paste is our friend)"
						resize="auto" required></sl-textarea>
				</fieldset>

				<div class="save">
					<sl-button id="close-drawer" variant="primary" label="submit" name="submit" type="submit"
					Label="Save" pill>Save</sl-button>
				</div>
				</form>
			<!--
			 <sl-button id="close-drawer" slot="footer"
			 	variant="primary">Closex</sl-button>
			-->
		</sl-drawer>
`;
		this.setContainer(settingsForm);
	}
	setContainer(settingsForm: string): void {
		const settingsContainer = document.querySelector<HTMLBaseElement>(
			'#settings-container'
		);
		settingsContainer
			? (settingsContainer.innerHTML = settingsForm)
			: console.error(`element doesn't exist`); // Set elementError
	}
}
