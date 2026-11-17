import { FLOWS } from './flows.js';
import { PEOPLE } from './people.js';
import { SYSTEMS } from './systems.js';

export const STEP_MAP = {};

FLOWS.forEach(flow => (flow.steps || []).forEach(step => {
  STEP_MAP[step.id] = Object.assign({}, step, { flowId: flow.n });
}));

export const TOTAL_FLOWS = FLOWS.length;

export const COLLABORATORS = Object.keys(PEOPLE).filter(id => !PEOPLE[id].lead);

export const DIGITACION_FLOW = FLOWS.find(flow => flow.kind === 'digitacion');

export const DIGITADORES = DIGITACION_FLOW
  ? DIGITACION_FLOW.people
  : Object.keys(PEOPLE).filter(id => PEOPLE[id].role === 'Digitadora');

export const TOTAL_SYSTEMS = Object.keys(SYSTEMS).length;
