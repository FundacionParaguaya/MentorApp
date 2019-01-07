import React from 'react'
import { shallow } from 'enzyme'
import { Platform } from 'react-native'
import FullWidthImage from 'react-native-fullwidth-image'
import { CachedImage } from '../CachedImage'

const createTestProps = props => ({
  ...props,
  source: 'some.url.png'
})

describe('CachedImage', () => {
  let wrapper
  let props
  describe('while checking net state', () => {
    beforeEach(() => {
      props = createTestProps()
      wrapper = shallow(<CachedImage {...props} />)
    })
  })
  describe('after net check', () => {
    beforeEach(async () => {
      props = createTestProps()
      wrapper = shallow(<CachedImage {...props} />)
    })

    it('renders <Image />', () => {
      expect(wrapper.find(FullWidthImage)).toHaveLength(1)
    })

    it('sets proper source based on OS', () => {
      expect(wrapper.instance().getProperSourceForOS('some.url.png')).toEqual(
        Platform.OS === 'android' ? 'file://some.url.png' : 'some.url.png'
      )
      expect(wrapper.find(FullWidthImage)).toHaveProp('source', {
        uri:
          Platform.OS === 'android' ? 'file://some.url.png' : 'foo/some.url.png'
      })
    })
  })
})
