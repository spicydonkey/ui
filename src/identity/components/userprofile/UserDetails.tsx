// Libraries
import React, {FC} from 'react'
import {useSelector} from 'react-redux'
import {
  AlignItems,
  ComponentStatus,
  FlexBox,
  FlexDirection,
  FontWeight,
  Form,
  FormDivider,
  Heading,
  HeadingElement,
  InfluxColors,
  JustifyContent,
} from '@influxdata/clockface'

// Selectors
import {selectQuartzIdentity} from 'src/identity/selectors/index'

// Components
import {UserProfileInput} from 'src/identity/components/userprofile/UserProfileInput'

export const UserDetails: FC = () => {
  const identity = useSelector(selectQuartzIdentity)
  const user = identity.currentIdentity.user

  return (
    <FlexBox direction={FlexDirection.Column} alignItems={AlignItems.FlexStart}>
      <Heading
        weight={FontWeight.Bold}
        element={HeadingElement.H4}
        className="user-details-container--header"
        testID="user-profile--user-details-header"
      >
        User Details
      </Heading>

      <Form>
        <UserProfileInput
          status={ComponentStatus.Disabled}
          header="Email"
          text={user.email}
          testID="user-profile--email"
          inputTestID="user-profile--email-input"
        />
        <FlexBox
          direction={FlexDirection.Row}
          alignItems={AlignItems.FlexStart}
          justifyContent={JustifyContent.FlexStart}
        >
          <UserProfileInput
            status={ComponentStatus.Disabled}
            header="First name"
            text={user.firstName}
            testID="user-profile--firstname"
            inputTestID="user-profile--firstname-input"
          />
          <UserProfileInput
            status={ComponentStatus.Disabled}
            header="Last name"
            text={user.lastName}
            testID="user-profile--lastname"
            inputTestID="user-profile--lastname-input"
          />
        </FlexBox>
      </Form>

      <FormDivider
        lineColor={InfluxColors.Grey15}
        className="user-profile-page--divider"
      />
    </FlexBox>
  )
}
