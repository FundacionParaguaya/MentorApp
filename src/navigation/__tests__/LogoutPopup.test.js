import React from 'react'
import { shallow } from 'enzyme'
import Popup from '../../components/Popup'
import LogoutPopup from '../LogoutPopup'
import { CheckBox } from 'react-native-elements'
import i18n from '../../i18n'
import colors from '../../theme.json'

const createTestProps = props => ({
  navigation: {
    getParam: () => true, // logoutModalOpen
    setParams: jest.fn()
  },
  showErrors: false,
  logingOut: false,
  checkboxesVisible: false,
  unsyncedDrafts: 0,
  logUserOut: jest.fn(),
  showCheckboxes: jest.fn(),
  onPressCheckbox: jest.fn(),
  onModalClose: jest.fn(),
  ...props
})

describe('Logout Modal', () => {
  let wrapper
  let props
  it('does not show unless proper nav peram is set', () => {
    const props = createTestProps({
      navigation: {
        getParam: () => false, // logoutModalOpen
        setParams: jest.fn()
      }
    })
    const wrapper = shallow(<LogoutPopup {...props} />)
    expect(wrapper.find(Popup)).toHaveProp({ isOpen: false })
  })

  describe('No unsynced data', () => {
    beforeEach(() => {
      props = createTestProps()
      wrapper = shallow(<LogoutPopup {...props} />)
    })

    it('shows proper modal content', () => {
      expect(wrapper.find('#ok-button')).toHaveProp({
        borderColor: colors.palegreen,
        handleClick: props.logUserOut,
        text: i18n.t('general.yes')
      })
    })

    it('logs user out', () => {
      wrapper
        .find('#ok-button')
        .props()
        .handleClick()

      expect(props.logUserOut).toHaveBeenCalledTimes(1)
    })

    it('closes the modal on pressing No/Cancel', () => {
      wrapper
        .find('#cancel-button')
        .props()
        .handleClick()

      expect(props.onModalClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Unsynced data', () => {
    beforeEach(() => {
      props = createTestProps({
        unsyncedDrafts: 2
      })
      wrapper = shallow(<LogoutPopup {...props} />)
    })

    it('shows proper modal content', () => {
      expect(wrapper.find('#ok-button')).toHaveProp({
        borderColor: colors.palered,
        handleClick: props.showCheckboxes
      })
    })

    it('show checkboxes before loging out', () => {
      wrapper
        .find('#ok-button')
        .props()
        .handleClick()

      expect(props.showCheckboxes).toHaveBeenCalledTimes(1)
    })

    describe('Checkboxes visible', () => {
      beforeEach(() => {
        props = createTestProps({
          unsyncedDrafts: 2,
          checkboxesVisible: true
        })
        wrapper = shallow(<LogoutPopup {...props} />)
      })

      it('calls onPressCheckbox on pressing a Checkbox', () => {
        wrapper
          .find(CheckBox)
          .first()
          .props()
          .onPress()

        expect(props.onPressCheckbox).toHaveBeenCalledTimes(1)
      })

      it('calls logUserOut on pressing Delete', () => {
        wrapper
          .find('#ok-button')
          .props()
          .handleClick()

        expect(props.logUserOut).toHaveBeenCalledTimes(1)
      })
    })
  })
})
