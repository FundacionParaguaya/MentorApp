import {shallow} from 'enzyme';
import React from 'react';

import Select from '../../../components/form/Select';
import TextInput from '../../../components/form/TextInput';
import {AddPriorityAndAchievementModal} from '../AddPriorityAndAchievementModal';

let draftId = 1;

const ACHIEVEMENT_COLOR = 3;
const PRIORITY_COLOR = 1;

const draft = {
  status: 'Draft',
  draftId,
  progress: {screen: 'FamilyParticipant', total: 5},
  familyData: {
    countFamilyMembers: 3,
    familyMembersList: [
      {
        firstName: 'Juan',
        lastName: 'Perez',
        documentNumber: '123456',
        documentType: '0',
        email: 'juan@gmail.com',
        birthCountry: 'PY',
        gender: 'M',
        birthDate: 12345,
        firstParticipant: true,
        socioEconomicAnswers: [
          {key: 'educationPersonMostStudied', value: 'SCHOOL-COMPLETE'},
          {key: 'receiveStateIncome', value: 'NO'},
        ],
      },
    ],
  },
  priorities: [],
  achievements: [],
};

const createTestProps = (props) => ({
  drafts: [draft],
  draftId,
  updateDraft: jest.fn(),
  indicatorText: '',
  t: (value) => value,
  indicator: '',
  onClose: jest.fn(),
  color: 1,
  ...props,
});

let props;
let wrapper;

beforeEach(() => {
  props = createTestProps();
  wrapper = shallow(<AddPriorityAndAchievementModal {...props} />);
});

it('gets proper draft from draftId', () => {
  expect(wrapper.instance().getDraft()).toBe(draft);
});

it('renders all inputs for add priority', () => {
  props = createTestProps({
    color: PRIORITY_COLOR,
  });
  wrapper = shallow(<AddPriorityAndAchievementModal {...props} />);
  expect(wrapper.find(TextInput)).toHaveLength(2);
  expect(wrapper.find(Select)).toHaveLength(1);
});
it('renders all inputs for add achievement', () => {
  props = createTestProps({
    color: ACHIEVEMENT_COLOR,
  });
  wrapper = shallow(<AddPriorityAndAchievementModal {...props} />);
  expect(wrapper.find(TextInput)).toHaveLength(2);
});

it('adds achievement', () => {
  props = createTestProps({
    color: ACHIEVEMENT_COLOR,
  });
  wrapper = shallow(<AddPriorityAndAchievementModal {...props} />);
  const spy = jest.spyOn(wrapper.instance(), 'addAchievement');

  wrapper.instance().onContinue();
  expect(spy).toHaveBeenCalledTimes(1);
});

it('adds priority', () => {
  props = createTestProps({
    color: PRIORITY_COLOR,
  });
  wrapper = shallow(<AddPriorityAndAchievementModal {...props} />);
  const spy = jest.spyOn(wrapper.instance(), 'addPriority');

  wrapper.instance().onContinue();
  expect(spy).toHaveBeenCalledTimes(1);
});
