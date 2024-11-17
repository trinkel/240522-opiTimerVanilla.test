import { appDefaults } from '../data/appDefaults';
import { stringifySeconds } from '../ts/timeUtilities';

export const settingsForm = `
		<sl-drawer label="Settings" id="settings" style="--size: max-content">
			<form id="settings-form">
				<fieldset id="start">
					<sl-input id="start-time" name="start-time" class="label-on-left"
						label="Start Time" help-text="Start-time for this session (eg: 10:45 AM)" type="time" autofocus
						required></sl-input>
				</fieldset>

				<fieldset id="timing">
					<sl-select id="practice-length" name="practice-length"
						class="label-on-left" label="Practice Length"
						help-text="Practice Length from schedule or 104" value="${appDefaults.practiceLength.toString()}" clearable
						required>
						<sl-option value="6">6 minutes</sl-option>
						<sl-option value="7">7 minutes</sl-option>
						<sl-option value="8">8 minutes</sl-option>
						<sl-option value="10">10 minutes</sl-option>
						<sl-option value="11">11 minutes</sl-option>
						<sl-option value="12">12 minutes</sl-option>
					</sl-select>
					<sl-radio-group id="pause-between-selector"
						name="pause-between-selector" class="label-on-left"
						label="Pause between teams"
						help-text="Will there be a pause between teams" value="${
							appDefaults.pauseBetweenSelector
						}">
						<sl-radio-button value="no" pill>No</sl-radio-button>
						<sl-radio-button value="yes" pill>Yes</sl-radio-button>
					</sl-radio-group>
					<sl-input id="pause-length" name="pause-length" class="label-on-left"
						label="Pause Length" disabled help-text="Length of pause in minutes:seconds"
						placeholder="00:00"
						 value="${stringifySeconds(
								appDefaults.pauseLength,
								false,
								'colon'
							)}"></sl-input>
				</fieldset>

				<fieldset id="operation-mode">
					<sl-radio-group id="operation-mode-selector"
						name="operation-mode-selector" class="label-on-left"
						label="Select operation mode" value="${appDefaults.operationMode}" required>
						<sl-radio-button value="anonymous" pill>
							Anonymous
						</sl-radio-button>
						<sl-radio-button id="team-list" name="team-list" value="list" pill>
							Team List
						</sl-radio-button>
					</sl-radio-group>
					<sl-input id="number-teams" name="number-teams"
						class="label-on-left" label="Number of teams"
						help-text="Enter the number of teams in this group" type="number"
						min="1" step="1" value="${appDefaults.numberTeams.toString()}" required></sl-input>
					<sl-textarea id="team-list" name="team-list"
						class="label-on-left" label="Team List" value="${appDefaults.teamList}" disabled
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
