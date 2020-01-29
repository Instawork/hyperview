// DO NOT EDIT: Auto-generate this file by running `yarn generate`
export default {
  'hyperview/src/components/hv-date-field/stories/basic.xml':
  `<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <styles>
      <style
        id="Body"
        backgroundColor="white"
        flex="1"
      />
      <style
        id="Input"
        borderBottomColor="#E1E1E1"
        borderBottomWidth="1"
        borderColor="#4E4D4D"
        flex="1"
        paddingBottom="8"
        paddingTop="8"
      >
        <modifier pressed="true">
          <style borderBottomColor="#4778FF" />
        </modifier>
        <modifier focused="true">
          <style borderBottomColor="#4778FF" />
        </modifier>
      </style>
      <style
        id="Input__Text"
        fontSize="16"
        fontWeight="normal"
      />
      <style
        id="PickerModal"
        backgroundColor="white"
        borderTopColor="#E1E1E1"
        borderTopWidth="1"
        shadowOffsetX="0"
        shadowOffsetY="-5"
        shadowOpacity="0.2"
        shadowRadius="5"
      />
      <style
        id="PickerModal__text"
        color="blue"
        fontSize="16"
        fontWeight="600"
        marginBottom="16"
        padding="24"
      >
        <modifier pressed="true">
          <style opacity="0.5" />
        </modifier>
      </style>
    </styles>
    <body style="Body">
      <date-field
        field-style="Input"
        field-text-style="Input__Text"
        label-format="MMMM D, YYYY"
        modal-style="PickerModal"
        modal-text-style="PickerModal__text"
        placeholder="Select date"
        placeholderTextColor="#8D9494"
      />
    </body>
  </screen>
</doc>
`,
  'hyperview/src/components/hv-image/stories/basic.xml':
  `<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <styles>
      <style id="Body"
        backgroundColor="white"
        flex="1"
      />
      <style id="img"
        width="200"
        height="200"
      />
    </styles>
    <body style="Body">
      <image source="https://upload.wikimedia.org/wikipedia/en/a/a4/Guns-N-Roses-1987.jpg" style="img" />
    </body>
  </screen>
</doc>
`,
  'hyperview/src/components/hv-list/stories/basic.xml':
  `<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <styles>
      <style alignItems="center"
            backgroundColor="white"
            borderBottomColor="#eee"
            borderBottomWidth="1"
            flexDirection="row"
            height="72"
            id="Header"
            paddingLeft="24"
            paddingRight="24"
            paddingTop="24" />
      <style color="blue"
            fontFamily="HKGrotesk-SemiBold"
            fontSize="16"
            id="Header__Back"
            paddingRight="16" />
      <style color="black"
            fontFamily="HKGrotesk-SemiBold"
            fontSize="24"
            id="Header__Title" />
      <style backgroundColor="white"
            flex="1"
            id="Body" />
      <style borderColor="red"
            borderRadius="4"
            borderWidth="2"
            fontFamily="HKGrotesk-SemiBold"
            fontSize="16"
            id="Description"
            margin="24"
            padding="16" />
      <style alignItems="center"
            borderBottomColor="#eee"
            borderBottomWidth="1"
            flex="1"
            flexDirection="row"
            height="48"
            id="Item"
            justifyContent="space-between"
            paddingLeft="24"
            paddingRight="24" />
      <style fontFamily="HKGrotesk-Regular"
            fontSize="18"
            id="Item__Label" />
      <style fontFamily="HKGrotesk-Bold"
            fontSize="18"
            id="Item__Chevron" />
    </styles>
    <body style="Body">
      <header style="Header">
        <text action="back"
              href="#"
              style="Header__Back">Back</text>
        <text style="Header__Title">Basic List</text>
      </header>
      <list>
        <item key="1"
              style="Item">
          <text style="Item__Label">List 1</text>
        </item>
        <item key="2"
              style="Item">
          <text style="Item__Label">List 2</text>
        </item>
        <item key="3"
              style="Item">
          <text style="Item__Label">List 3</text>
        </item>
        <item key="4"
              style="Item">
          <text style="Item__Label">List 4</text>
        </item>
        <item key="5"
              style="Item">
          <text style="Item__Label">List 5</text>
        </item>
        <item key="6"
              style="Item">
          <text style="Item__Label">List 6</text>
        </item>
        <item key="7"
              style="Item">
          <text style="Item__Label">List 7</text>
        </item>
        <item key="8"
              style="Item">
          <text style="Item__Label">List 8</text>
        </item>
        <item key="9"
              style="Item">
          <text style="Item__Label">List 9</text>
        </item>
        <item key="10"
              style="Item">
          <text style="Item__Label">List 10</text>
        </item>
        <item key="11"
              style="Item">
          <text style="Item__Label">List 11</text>
        </item>
        <item key="12"
              style="Item">
          <text style="Item__Label">List 12</text>
        </item>
        <item key="13"
              style="Item">
          <text style="Item__Label">List 13</text>
        </item>
        <item key="14"
              style="Item">
          <text style="Item__Label">List 14</text>
        </item>
        <item key="15"
              style="Item">
          <text style="Item__Label">List 15</text>
        </item>
        <item key="16"
              style="Item">
          <text style="Item__Label">List 16</text>
        </item>
        <item key="17"
              style="Item">
          <text style="Item__Label">List 17</text>
        </item>
        <item key="18"
              style="Item">
          <text style="Item__Label">List 18</text>
        </item>
        <item key="19"
              style="Item">
          <text style="Item__Label">List 19</text>
        </item>
        <item key="20"
              style="Item">
          <text style="Item__Label">List 20</text>
        </item>
      </list>
    </body>
  </screen>
</doc>
`,
  'hyperview/src/components/hv-list/stories/infinite_scroll.xml':
  `<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <styles>
      <style alignItems="center"
             backgroundColor="white"
             borderBottomColor="#eee"
             borderBottomWidth="1"
             flexDirection="row"
             height="72"
             id="Header"
             paddingLeft="24"
             paddingRight="24"
             paddingTop="24" />
      <style color="blue"
             fontFamily="HKGrotesk-SemiBold"
             fontSize="16"
             id="Header__Back"
             paddingRight="16" />
      <style color="black"
             fontFamily="HKGrotesk-SemiBold"
             fontSize="24"
             id="Header__Title" />
      <style backgroundColor="white"
             flex="1"
             id="Body" />
      <style borderColor="red"
             borderRadius="4"
             borderWidth="2"
             fontFamily="HKGrotesk-SemiBold"
             fontSize="16"
             id="Description"
             margin="24"
             padding="16" />
      <style alignItems="center"
             borderBottomColor="#eee"
             borderBottomWidth="1"
             flex="1"
             flexDirection="row"
             height="48"
             id="Item"
             justifyContent="space-between"
             paddingLeft="24"
             paddingRight="24" />
      <style fontFamily="HKGrotesk-Regular"
             fontSize="18"
             id="Item__Label" />
      <style fontFamily="HKGrotesk-Bold"
             fontSize="18"
             id="Item__Chevron" />
      <style flex="1"
             flexDirection="row"
             id="Spinner"
             justifyContent="center"
             padding="24" />
    </styles>
    <body style="Body">
      <header style="Header">
        <text action="back"
              href="#"
              style="Header__Back">Back</text>
        <text style="Header__Title">List With Infinite Scroll</text>
      </header>
      <list id="myList">
        <item key="1"
              style="Item">
          <text style="Item__Label">List 1</text>
        </item>
        <item key="2"
              style="Item">
          <text style="Item__Label">List 2</text>
        </item>
        <item key="3"
              style="Item">
          <text style="Item__Label">List 3</text>
        </item>
        <item key="4"
              style="Item">
          <text style="Item__Label">List 4</text>
        </item>
        <item key="5"
              style="Item">
          <text style="Item__Label">List 5</text>
        </item>
        <item key="6"
              style="Item">
          <text style="Item__Label">List 6</text>
        </item>
        <item key="7"
              style="Item">
          <text style="Item__Label">List 7</text>
        </item>
        <item key="8"
              style="Item">
          <text style="Item__Label">List 8</text>
        </item>
        <item key="9"
              style="Item">
          <text style="Item__Label">List 9</text>
        </item>
        <item key="10"
              style="Item">
          <text style="Item__Label">List 10</text>
        </item>
        <item key="11"
              style="Item">
          <text style="Item__Label">List 11</text>
        </item>
        <item key="12"
              style="Item">
          <text style="Item__Label">List 12</text>
        </item>
        <item key="13"
              style="Item">
          <text style="Item__Label">List 13</text>
        </item>
        <item key="14"
              style="Item">
          <text style="Item__Label">List 14</text>
        </item>
        <item key="15"
              style="Item">
          <text style="Item__Label">List 15</text>
        </item>
        <item key="16"
              style="Item">
          <text style="Item__Label">List 16</text>
        </item>
        <item key="17"
              style="Item">
          <text style="Item__Label">List 17</text>
        </item>
        <item key="18"
              style="Item">
          <text style="Item__Label">List 18</text>
        </item>
        <item key="19"
              style="Item">
          <text style="Item__Label">List 19</text>
        </item>
        <item action="append"
              delay="1000"
              href="/ui_elements/list/_infinite_scroll_page2.xml"
              key="20"
              once="true"
              show-during-load="myIndicator"
              style="Item"
              target="myList"
              trigger="visible">
          <text style="Item__Label">List 20</text>
        </item>
      </list>
      <view hide="true"
            id="myIndicator"
            style="Spinner">
        <spinner />
      </view>
    </body>
  </screen>
</doc>
`,
  'hyperview/src/components/hv-option/stories/basic.xml':
  `<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <styles>
      <style id="Body"
        backgroundColor="white"
        flex="1"
      />
      <style id="Select__Option"
        flex="1"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingLeft="24"
        paddingRight="24"
        paddingBottom="16"
        paddingTop="16"
      />
      <style id="Select__RadioOuter"
        width="20"
        height="20"
        borderRadius="10"
        borderWidth="1"
        borderColor="#bdc4c4"
      >
        <modifier pressed="true">
          <style borderColor="#8d9494" borderWidth="1" />
        </modifier>
        <modifier selected="true">
          <style borderColor="#4778ff" borderWidth="2" />
        </modifier>
      </style>

      <style id="Select__RadioInner"
        width="10"
        height="10"
        borderRadius="5"
        opacity="0"
        marginTop="3"
        marginLeft="3"
      >
        <modifier selected="true">
          <style backgroundColor="#4778ff" opacity="1" />
        </modifier>
      </style>

      <style id="Select__Label"
        fontFamily="HKGrotesk-Regular"
        color="#4e4d4d"
        fontSize="16"
        lineHeight="18"
      >
        <modifier selected="true">
          <style color="#312f2f" />
        </modifier>
        <modifier pressed="true">
          <style color="#312f2f" />
        </modifier>
      </style>
    </styles>
    <body style="Body">
      <option style="Select__Option" value="paid_parking">
        <text style="Select__Label">Paid parking</text>
        <view style="Select__RadioOuter"><view style="Select__RadioInner"></view></view>
      </option>
    </body>
  </screen>
</doc>
`,
  'hyperview/src/components/hv-option/stories/custom.xml':
  `<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <styles>
      <style id="Body"
        backgroundColor="white"
        flex="1"
      />
      <style id="SelectCustom"
        flex="1"
        flexDirection="row"
        marginLeft="24"
        marginRight="24"
        marginBottom="40"
        marginTop="24"
      />
      <style id="SelectCustom__Option"
        flex="1"
        justifyContent="flex-start"
        alignItems="center"
        borderRadius="4"
        borderWidth="1"
        borderColor="#BDC4C4"
        padding="16"
        marginRight="8"
      >
        <modifier selected="true">
          <style borderColor="#4778FF" />
        </modifier>
      </style>
      <style id="SelectCustom__Label"
        fontFamily="HKGrotesk-Regular"
        color="#4e4d4d"
        fontSize="16"
        lineHeight="18"
        textAlign="center"
      >
        <modifier selected="true">
          <style color="#4778FF" fontFamily="HKGrotesk-Medium" />
        </modifier>
      </style>

      <style id="SelectCustom__ImageWrapper"
        marginBottom="8"
        width="32"
        height="32"
      />
      <style id="SelectCustom__Image"
        width="32"
        height="32"
        position="absolute"
        top="0"
        left="0"
        backgroundColor="blue"
      />
      <style id="SelectCustom__Image--Unselected">
        <modifier selected="true">
          <style width="0" height="0" />
        </modifier>
      </style>
      <style id="SelectCustom__Image--Selected" width="0" height="0">
        <modifier selected="true">
          <style width="32" height="32" />
        </modifier>
      </style>
    </styles>

    <body style="Body">
      <option style="SelectCustom__Option" value="free_parking" selected="true">
        <view style="SelectCustom__ImageWrapper">
          <image style="SelectCustom__Image SelectCustom__Image--Unselected" source="/ui_elements/forms/unselected.png" />
          <image style="SelectCustom__Image SelectCustom__Image--Selected" source="/ui_elements/forms/selected.png" />
        </view>
        <text style="SelectCustom__Label">Free parking</text>
      </option>
    </body>
  </screen>
</doc>
`,
  'hyperview/src/components/hv-option/stories/pre_selected.xml':
  `<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <styles>
      <style id="Body"
        backgroundColor="white"
        flex="1"
      />
      <style id="Select__Option"
        flex="1"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingLeft="24"
        paddingRight="24"
        paddingBottom="16"
        paddingTop="16"
      />
      <style id="Select__RadioOuter"
        width="20"
        height="20"
        borderRadius="10"
        borderWidth="1"
        borderColor="#bdc4c4"
      >
        <modifier pressed="true">
          <style borderColor="#8d9494" borderWidth="1" />
        </modifier>
        <modifier selected="true">
          <style borderColor="#4778ff" borderWidth="2" />
        </modifier>
      </style>

      <style id="Select__RadioInner"
        width="10"
        height="10"
        borderRadius="5"
        opacity="0"
        marginTop="3"
        marginLeft="3"
      >
        <modifier selected="true">
          <style backgroundColor="#4778ff" opacity="1" />
        </modifier>
      </style>

      <style id="Select__Label"
        fontFamily="HKGrotesk-Regular"
        color="#4e4d4d"
        fontSize="16"
        lineHeight="18"
      >
        <modifier selected="true">
          <style color="#312f2f" />
        </modifier>
        <modifier pressed="true">
          <style color="#312f2f" />
        </modifier>
      </style>
    </styles>
    <body style="Body">
      <option style="Select__Option" value="paid_parking" selected="true">
        <text style="Select__Label">Paid parking</text>
        <view style="Select__RadioOuter"><view style="Select__RadioInner"></view></view>
      </option>
    </body>
  </screen>
</doc>
`,
  'hyperview/src/components/hv-picker-field/stories/basic.xml':
  `<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <styles>
      <style id="Header"
             alignItems="center"
             backgroundColor="white"
             borderBottomColor="#eee"
             borderBottomWidth="1"
             flexDirection="row"
             height="72"
             paddingLeft="24"
             paddingRight="24"
             paddingTop="24" />
      <style id="Header__Back"
             color="blue"
             fontSize="16"
             fontWeight="600"
             paddingRight="16" />
      <style id="Header__Title"
             color="black"
             fontSize="24"
             fontWeight="600" />
      <style id="Body"
             backgroundColor="white"
             flex="1" />
      <style id="Description"
             fontSize="16"
             fontWeight="600"
             marginLeft="24"
             marginRight="24"
             marginTop="24" />
      <style id="FormGroup"
             flex="1"
             marginLeft="24"
             marginRight="24"
             marginTop="48" />
      <style id="Input"
             borderBottomColor="#E1E1E1"
             borderBottomWidth="1"
             borderColor="#4E4D4D"
             flex="1"
             paddingBottom="8"
             paddingTop="8">
        <modifier pressed="true">
          <style borderBottomColor="#4778FF" />
        </modifier>
        <modifier focused="true">
          <style borderBottomColor="#4778FF" />
        </modifier>
      </style>
      <style id="Input__Text"
             fontSize="16"
             fontWeight="normal"></style>
      <style id="Input--Error"
             borderBottomColor="#FF4847">
        <modifier focused="true">
          <style borderBottomColor="#FF4847" />
        </modifier>
      </style>
      <style id="Input__Text--Error"
             color="#FF4847"></style>
      <style id="label"
             borderColor="#4E4D4D"
             fontSize="16"
             fontWeight="bold"
             lineHeight="24"
             marginBottom="8" />
      <style id="help"
             borderColor="#FF4847"
             fontSize="16"
             fontWeight="normal"
             lineHeight="24"
             marginTop="16" />
      <style id="help--error"
             color="#FF4847" />
      <style id="PickerModal"
             backgroundColor="white"
             borderTopColor="#E1E1E1"
             borderTopWidth="1" />
      <style id="PickerModal__text"
             color="blue"
             fontSize="16"
             fontWeight="600"
             padding="24"
             paddingBottom="0">
        <modifier pressed="true">
          <style opacity="0.5" />
        </modifier>
      </style>
      <style id="InputCustom"
             borderColor="#4E4D4D"
             borderRadius="4"
             borderWidth="2"
             flex="1"
             fontWeight="normal"
             marginBottom="40"
             paddingBottom="8"
             paddingLeft="8"
             paddingRight="8"
             paddingTop="8">
        <modifier pressed="true">
          <style borderColor="#4778FF" />
        </modifier>
        <modifier focused="true">
          <style borderColor="#4778FF" />
        </modifier>
      </style>
      <style id="InputCustom__Text"
             color="purple"
             fontSize="18"
             fontWeight="600"></style>
      <style id="PickerModalCustom"
             backgroundColor="purple"
             borderTopColor="#E1E1E1"
             borderTopWidth="1" />
      <style id="PickerModalCustom__text"
             color="white"
             fontSize="20"
             fontWeight="600"
             padding="24"
             paddingBottom="0">
        <modifier pressed="true">
          <style color="yellow" />
        </modifier>
      </style>
    </styles>
    <body style="Body">
      <header style="Header">
        <text action="back"
              href="#"
              style="Header__Back">Back</text>
        <text style="Header__Title">Picker</text>
      </header>
      <view scroll="true"
            style="Main">
        <text style="Description">Picker fields open a system-appropriate modal to choose a single value from a list of options. On iOS, styles can be applied to the modal and save/cancel labels.</text>
        <view style="FormGroup">
          <text style="label">Default picker field</text>
          <picker-field field-style="Input"
                        field-text-style="Input__Text"
                        modal-style="PickerModal"
                        modal-text-style="PickerModal__text"
                        placeholder="Select choice"
                        placeholderTextColor="#8D9494">
            <picker-item label="Choice 0"
                         value="0" />
            <picker-item label="Choice 1"
                         value="1" />
            <picker-item label="Choice 2"
                         value="2" />
            <picker-item label="Choice 3"
                         value="3" />
            <picker-item label="Choice 4"
                         value="4" />
            <picker-item label="Choice 5"
                         value="5" />
            <picker-item label="Choice 6"
                         value="6" />
          </picker-field>
        </view>
        <view style="FormGroup">
          <text style="label">Filled picker field</text>
          <picker-field field-style="Input"
                        field-text-style="Input__Text"
                        modal-style="PickerModal"
                        modal-text-style="PickerModal__text"
                        placeholder="Select choice"
                        placeholderTextColor="#8D9494"
                        value="3">
            <picker-item label="Choice 0"
                         value="0" />
            <picker-item label="Choice 1"
                         value="1" />
            <picker-item label="Choice 2"
                         value="2" />
            <picker-item label="Choice 3"
                         value="3" />
            <picker-item label="Choice 4"
                         value="4" />
            <picker-item label="Choice 5"
                         value="5" />
            <picker-item label="Choice 6"
                         value="6" />
          </picker-field>
        </view>
        <view style="FormGroup">
          <text style="label">De-selectable picker field</text>
          <picker-field field-style="Input"
                        field-text-style="Input__Text"
                        modal-style="PickerModal"
                        modal-text-style="PickerModal__text"
                        placeholder="Select choice"
                        placeholderTextColor="#8D9494"
                        value="3">
            <picker-item label="No choice"
                         value="" />
            <picker-item label="Choice 0"
                         value="0" />
            <picker-item label="Choice 1"
                         value="1" />
            <picker-item label="Choice 2"
                         value="2" />
            <picker-item label="Choice 3"
                         value="3" />
            <picker-item label="Choice 4"
                         value="4" />
            <picker-item label="Choice 5"
                         value="5" />
            <picker-item label="Choice 6"
                         value="6" />
          </picker-field>
        </view>
        <view style="FormGroup">
          <text style="label">Validation error</text>
          <picker-field field-style="Input Input--Error"
                        field-text-style="Input__Text Input__Text--Error"
                        modal-style="PickerModal"
                        modal-text-style="PickerModal__text"
                        placeholder="Select choice"
                        placeholderTextColor="#8D9494">
            <picker-item label="Choice 0"
                         value="0" />
            <picker-item label="Choice 1"
                         value="1" />
            <picker-item label="Choice 2"
                         value="2" />
            <picker-item label="Choice 3"
                         value="3" />
            <picker-item label="Choice 4"
                         value="4" />
            <picker-item label="Choice 5"
                         value="5" />
            <picker-item label="Choice 6"
                         value="6" />
          </picker-field>
          <text style="help help--error">Please select a choice</text>
        </view>
        <view style="FormGroup">
          <text style="label">Filled validation error</text>
          <picker-field field-style="Input Input--Error"
                        field-text-style="Input__Text Input__Text--Error"
                        modal-style="PickerModal"
                        modal-text-style="PickerModal__text"
                        placeholder="Select choice"
                        placeholderTextColor="#8D9494"
                        value="3">
            <picker-item label="Choice 0"
                         value="0" />
            <picker-item label="Choice 1"
                         value="1" />
            <picker-item label="Choice 2"
                         value="2" />
            <picker-item label="Choice 3"
                         value="3" />
            <picker-item label="Choice 4"
                         value="4" />
            <picker-item label="Choice 5"
                         value="5" />
            <picker-item label="Choice 6"
                         value="6" />
          </picker-field>
          <text style="help help--error">Please select a different choice</text>
        </view>
        <view style="FormGroup">
          <text style="label">Customized</text>
          <picker-field cancel-label="Nevermind"
                        field-style="InputCustom"
                        field-text-style="InputCustom__Text"
                        modal-style="PickerModalCustom"
                        modal-text-style="PickerModalCustom__text"
                        placeholder="Select choice"
                        placeholderTextColor="#8D9494"
                        save-label="Set choice">
            <picker-item label="Choice 0"
                         value="0" />
            <picker-item label="Choice 1"
                         value="1" />
            <picker-item label="Choice 2"
                         value="2" />
            <picker-item label="Choice 3"
                         value="3" />
            <picker-item label="Choice 4"
                         value="4" />
            <picker-item label="Choice 5"
                         value="5" />
            <picker-item label="Choice 6"
                         value="6" />
          </picker-field>
        </view>
      </view>
    </body>
  </screen>
</doc>
`,
  'hyperview/src/components/hv-section-list/stories/basic.xml':
  `<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <styles>
      <style alignItems="center"
             backgroundColor="white"
             borderBottomColor="#eee"
             borderBottomWidth="1"
             flexDirection="row"
             height="72"
             id="Header"
             paddingLeft="24"
             paddingRight="24"
             paddingTop="24" />
      <style color="blue"
             fontFamily="HKGrotesk-SemiBold"
             fontSize="16"
             id="Header__Back"
             paddingRight="16" />
      <style color="black"
             fontFamily="HKGrotesk-SemiBold"
             fontSize="24"
             id="Header__Title" />
      <style backgroundColor="white"
             flex="1"
             id="Body" />
      <style borderColor="red"
             borderRadius="4"
             borderWidth="2"
             fontFamily="HKGrotesk-SemiBold"
             fontSize="16"
             id="Description"
             margin="24"
             padding="16" />
      <style alignItems="center"
             backgroundColor="#eee"
             flex="1"
             flexDirection="row"
             height="48"
             id="List__Header"
             paddingLeft="24"
             paddingRight="24" />
      <style fontFamily="HKGrotesk-Bold"
             fontSize="18"
             id="List__HeaderText" />
      <style alignItems="center"
             borderBottomColor="#eee"
             borderBottomWidth="1"
             flex="1"
             flexDirection="row"
             height="48"
             id="Item"
             justifyContent="space-between"
             paddingLeft="24"
             paddingRight="24" />
      <style fontFamily="HKGrotesk-Regular"
             fontSize="18"
             id="Item__Label" />
      <style fontFamily="HKGrotesk-Bold"
             fontSize="18"
             id="Item__Chevron" />
    </styles>
    <body style="Body">
      <header style="Header">
        <text action="back"
              href="#"
              style="Header__Back">Back</text>
        <text style="Header__Title">Basic Section List</text>
      </header>
      <section-list>
        <section>
          <section-title style="List__Header">
            <text style="List__HeaderText">Section 1</text>
          </section-title>
          <item key="1"
                style="Item">
            <text style="Item__Label">List 1</text>
          </item>
          <item key="2"
                style="Item">
            <text style="Item__Label">List 2</text>
          </item>
          <item key="3"
                style="Item">
            <text style="Item__Label">List 3</text>
          </item>
          <item key="4"
                style="Item">
            <text style="Item__Label">List 4</text>
          </item>
          <item key="5"
                style="Item">
            <text style="Item__Label">List 5</text>
          </item>
        </section>
        <section>
          <section-title style="List__Header">
            <text style="List__HeaderText">Section 2</text>
          </section-title>
          <item key="6"
                style="Item">
            <text style="Item__Label">List 6</text>
          </item>
          <item key="7"
                style="Item">
            <text style="Item__Label">List 7</text>
          </item>
          <item key="8"
                style="Item">
            <text style="Item__Label">List 8</text>
          </item>
          <item key="9"
                style="Item">
            <text style="Item__Label">List 9</text>
          </item>
          <item key="10"
                style="Item">
            <text style="Item__Label">List 10</text>
          </item>
        </section>
        <section>
          <section-title style="List__Header">
            <text style="List__HeaderText">Section 3</text>
          </section-title>
          <item key="11"
                style="Item">
            <text style="Item__Label">List 11</text>
          </item>
          <item key="12"
                style="Item">
            <text style="Item__Label">List 12</text>
          </item>
          <item key="13"
                style="Item">
            <text style="Item__Label">List 13</text>
          </item>
          <item key="14"
                style="Item">
            <text style="Item__Label">List 14</text>
          </item>
          <item key="15"
                style="Item">
            <text style="Item__Label">List 15</text>
          </item>
        </section>
        <section>
          <section-title style="List__Header">
            <text style="List__HeaderText">Section 4</text>
          </section-title>
          <item key="16"
                style="Item">
            <text style="Item__Label">List 16</text>
          </item>
          <item key="17"
                style="Item">
            <text style="Item__Label">List 17</text>
          </item>
          <item key="18"
                style="Item">
            <text style="Item__Label">List 18</text>
          </item>
          <item key="19"
                style="Item">
            <text style="Item__Label">List 19</text>
          </item>
          <item key="20"
                style="Item">
            <text style="Item__Label">List 20</text>
          </item>
        </section>
      </section-list>
    </body>
  </screen>
</doc>
`,
  'hyperview/src/components/hv-section-list/stories/infinite_scroll.xml':
  `<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <styles>
      <style alignItems="center"
             backgroundColor="white"
             borderBottomColor="#eee"
             borderBottomWidth="1"
             flexDirection="row"
             height="72"
             id="Header"
             paddingLeft="24"
             paddingRight="24"
             paddingTop="24" />
      <style color="blue"
             fontFamily="HKGrotesk-SemiBold"
             fontSize="16"
             id="Header__Back"
             paddingRight="16" />
      <style color="black"
             fontFamily="HKGrotesk-SemiBold"
             fontSize="24"
             id="Header__Title" />
      <style backgroundColor="white"
             flex="1"
             id="Body" />
      <style borderColor="red"
             borderRadius="4"
             borderWidth="2"
             fontFamily="HKGrotesk-SemiBold"
             fontSize="16"
             id="Description"
             margin="24"
             padding="16" />
      <style alignItems="center"
             backgroundColor="#eee"
             flex="1"
             flexDirection="row"
             height="48"
             id="List__Header"
             paddingLeft="24"
             paddingRight="24" />
      <style fontFamily="HKGrotesk-Bold"
             fontSize="18"
             id="List__HeaderText" />
      <style alignItems="center"
             borderBottomColor="#eee"
             borderBottomWidth="1"
             flex="1"
             flexDirection="row"
             height="48"
             id="Item"
             justifyContent="space-between"
             paddingLeft="24"
             paddingRight="24" />
      <style fontFamily="HKGrotesk-Regular"
             fontSize="18"
             id="Item__Label" />
      <style fontFamily="HKGrotesk-Bold"
             fontSize="18"
             id="Item__Chevron" />
      <style flex="1"
             flexDirection="row"
             id="Spinner"
             justifyContent="center"
             padding="24" />
    </styles>
    <body style="Body">
      <header style="Header">
        <text action="back"
              href="#"
              style="Header__Back">Back</text>
        <text style="Header__Title">Section List Infinite Scroll</text>
      </header>
      <section-list id="myList">
        <section>
          <section-title style="List__Header">
            <text style="List__HeaderText">Section 1</text>
          </section-title>
          <item key="1"
                style="Item">
            <text style="Item__Label">List 1</text>
          </item>
          <item key="2"
                style="Item">
            <text style="Item__Label">List 2</text>
          </item>
          <item key="3"
                style="Item">
            <text style="Item__Label">List 3</text>
          </item>
          <item key="4"
                style="Item">
            <text style="Item__Label">List 4</text>
          </item>
          <item key="5"
                style="Item">
            <text style="Item__Label">List 5</text>
          </item>
        </section>
        <section>
          <section-title style="List__Header">
            <text style="List__HeaderText">Section 2</text>
          </section-title>
          <item key="6"
                style="Item">
            <text style="Item__Label">List 6</text>
          </item>
          <item key="7"
                style="Item">
            <text style="Item__Label">List 7</text>
          </item>
          <item key="8"
                style="Item">
            <text style="Item__Label">List 8</text>
          </item>
          <item key="9"
                style="Item">
            <text style="Item__Label">List 9</text>
          </item>
          <item key="10"
                style="Item">
            <text style="Item__Label">List 10</text>
          </item>
        </section>
        <section>
          <section-title style="List__Header">
            <text style="List__HeaderText">Section 3</text>
          </section-title>
          <item key="11"
                style="Item">
            <text style="Item__Label">List 11</text>
          </item>
          <item key="12"
                style="Item">
            <text style="Item__Label">List 12</text>
          </item>
          <item key="13"
                style="Item">
            <text style="Item__Label">List 13</text>
          </item>
          <item key="14"
                style="Item">
            <text style="Item__Label">List 14</text>
          </item>
          <item key="15"
                style="Item">
            <text style="Item__Label">List 15</text>
          </item>
        </section>
        <section>
          <section-title style="List__Header">
            <text style="List__HeaderText">Section 4</text>
          </section-title>
          <item key="16"
                style="Item">
            <text style="Item__Label">List 16</text>
          </item>
          <item key="17"
                style="Item">
            <text style="Item__Label">List 17</text>
          </item>
          <item key="18"
                style="Item">
            <text style="Item__Label">List 18</text>
          </item>
          <item key="19"
                style="Item">
            <text style="Item__Label">List 19</text>
          </item>
          <item action="append"
                delay="1000"
                href="/ui_elements/sectionlist/_infinite_scroll_page2.xml"
                key="20"
                once="true"
                show-during-load="myIndicator"
                style="Item"
                target="myList"
                trigger="visible">
            <text style="Item__Label">List 20</text>
          </item>
        </section>
      </section-list>
      <view hide="true"
            id="myIndicator"
            style="Spinner">
        <spinner />
      </view>
    </body>
  </screen>
</doc>
`,
  'hyperview/src/components/hv-select-multiple/stories/basic.xml':
  `<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <styles>
      <style alignItems="center"
             backgroundColor="white"
             borderBottomColor="#eee"
             borderBottomWidth="1"
             flexDirection="row"
             height="72"
             id="Header"
             paddingLeft="24"
             paddingRight="24"
             paddingTop="24" />
      <style color="blue"
             fontFamily="HKGrotesk-SemiBold"
             fontSize="16"
             id="Header__Back"
             paddingRight="16" />
      <style color="black"
             fontFamily="HKGrotesk-SemiBold"
             fontSize="24"
             id="Header__Title" />
      <style backgroundColor="white"
             flex="1"
             id="Body" />
      <style 
             fontFamily="HKGrotesk-SemiBold"
             fontSize="16"
             id="Description"
             marginLeft="24"
             marginRight="24"
             marginTop="24"
             />

      <style id="Select"
        marginTop="24"
      />
      <style id="Select__Separator"
        borderTopWidth="1"
        borderTopColor="#e1e3e3"
        marginLeft="24"
        marginRight="24"
      />
      <style id="Select__Option"
        flex="1"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingLeft="24"
        paddingRight="24"
        paddingBottom="16"
        paddingTop="16"
      />
      <style id="Select__RadioOuter"
        width="20"
        height="20"
        borderRadius="10"
        borderWidth="1"
        borderColor="#bdc4c4"
      >
        <modifier pressed="true">
          <style borderColor="#8d9494" borderWidth="1" />
        </modifier>
        <modifier selected="true">
          <style borderColor="#4778ff" borderWidth="2" />
        </modifier>
      </style>

      <style id="Select__RadioInner"
        width="10"
        height="10"
        borderRadius="5"
        opacity="0"
        marginTop="3"
        marginLeft="3"
      >
        <modifier selected="true">
          <style backgroundColor="#4778ff" opacity="1" />
        </modifier>
      </style>

      <style id="Select__Label"
             fontFamily="HKGrotesk-Regular"
             color="#4e4d4d"
             fontSize="16"
             lineHeight="18"
      >
        <modifier selected="true">
          <style color="#312f2f" />
        </modifier>
        <modifier pressed="true">
          <style color="#312f2f" />
        </modifier>
      </style>

      <style id="SelectCustom"
        flex="1"
        flexDirection="row"
        marginLeft="24"
        marginRight="24"
        marginBottom="40"
        marginTop="24"
      />
      <style id="SelectCustom__Option"
        flex="1"
        justifyContent="flex-start"
        alignItems="center"
        borderRadius="4"
        borderWidth="1"
        borderColor="#BDC4C4"
        padding="16"
        marginRight="8"
      >
        <modifier selected="true">
          <style borderColor="#4778FF" />
        </modifier>
      </style>
      <style id="SelectCustom__Label"
             fontFamily="HKGrotesk-Regular"
             color="#4e4d4d"
             fontSize="16"
             lineHeight="18"
             textAlign="center"
      >
        <modifier selected="true">
          <style color="#4778FF" fontFamily="HKGrotesk-Medium" />
        </modifier>
      </style>

      <style id="SelectCustom__ImageWrapper" marginBottom="8" width="32" height="32" />
      <style id="SelectCustom__Image" width="32" height="32" position="absolute" top="0" left="0">
      <style id="SelectCustom__Image--Unselected">
        <modifier selected="true">
          <style width="0" height="0" />
        </modifier>
      </style>
      <style id="SelectCustom__Image--Selected" width="0" height="0">
        <modifier selected="true">
          <style width="32" height="32" />
        </modifier>
      </style>
    </styles>

    <body style="Body">
      <header style="Header">
        <text action="back"
              href="#"
              style="Header__Back">Back</text>
        <text style="Header__Title">Select Multiple</text>
      </header>
      <view scroll="true" style="Main">

        <text style="Description">Simple Select</text>
        <select-multiple style="Select" name="choice">
          <view style="Select__Separator" />
          <option style="Select__Option" value="paid_parking">
            <text style="Select__Label">Paid parking</text>
            <view style="Select__RadioOuter"><view style="Select__RadioInner"></view></view>
          </option>
          <view style="Select__Separator" />
          <option style="Select__Option" value="free_parking">
            <text style="Select__Label">Free parking</text>
            <view style="Select__RadioOuter"><view style="Select__RadioInner"></view></view>
          </option>
          <view style="Select__Separator" />
          <option style="Select__Option" value="unknown_parking">
            <text style="Select__Label">Unknown</text>
            <view style="Select__RadioOuter"><view style="Select__RadioInner"></view></view>
          </option>
          <view style="Select__Separator" />
        </select-multiple>

        <text style="Description">Pre-selected</text>
        <select-multiple style="Select" name="choice">
          <view style="Select__Separator" />
          <option style="Select__Option" value="paid_parking">
            <text style="Select__Label">Paid parking</text>
            <view style="Select__RadioOuter"><view style="Select__RadioInner"></view></view>
          </option>
          <view style="Select__Separator" />
          <option style="Select__Option" value="free_parking" selected="true">
            <text style="Select__Label">Free parking</text>
            <view style="Select__RadioOuter"><view style="Select__RadioInner"></view></view>
          </option>
          <view style="Select__Separator" />
          <option style="Select__Option" value="unknown_parking" selected="true">
            <text style="Select__Label">Unknown</text>
            <view style="Select__RadioOuter"><view style="Select__RadioInner"></view></view>
          </option>
          <view style="Select__Separator" />
        </select-multiple>

        <text style="Description">Custom</text>
        <select-multiple style="SelectCustom" name="choice">
          <option style="SelectCustom__Option" value="paid_parking">
            <view style="SelectCustom__ImageWrapper">
              <image style="SelectCustom__Image SelectCustom__Image--Unselected" source="/ui_elements/forms/unselected.png" />
              <image style="SelectCustom__Image SelectCustom__Image--Selected" source="/ui_elements/forms/selected.png" />
            </view>
            <text style="SelectCustom__Label">Paid parking</text>
          </option>
          <option style="SelectCustom__Option" value="free_parking" selected="true">
            <view style="SelectCustom__ImageWrapper">
              <image style="SelectCustom__Image SelectCustom__Image--Unselected" source="/ui_elements/forms/unselected.png" />
              <image style="SelectCustom__Image SelectCustom__Image--Selected" source="/ui_elements/forms/selected.png" />
            </view>
            <text style="SelectCustom__Label">Free parking</text>
          </option>
          <option style="SelectCustom__Option" value="unknown_parking">
            <view style="SelectCustom__ImageWrapper">
              <image style="SelectCustom__Image SelectCustom__Image--Unselected" source="/ui_elements/forms/unselected.png" />
              <image style="SelectCustom__Image SelectCustom__Image--Selected" source="/ui_elements/forms/selected.png" />
            </view>
            <text style="SelectCustom__Label">Unknown</text>
          </option>
        </select-multiple>

      </view>
    </body>
  </screen>
</doc>
`,
  'hyperview/src/components/hv-select-single/stories/basic.xml':
  `<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <styles>
      <style alignItems="center"
             backgroundColor="white"
             borderBottomColor="#eee"
             borderBottomWidth="1"
             flexDirection="row"
             height="72"
             id="Header"
             paddingLeft="24"
             paddingRight="24"
             paddingTop="24" />
      <style color="blue"
             fontFamily="HKGrotesk-SemiBold"
             fontSize="16"
             id="Header__Back"
             paddingRight="16" />
      <style color="black"
             fontFamily="HKGrotesk-SemiBold"
             fontSize="24"
             id="Header__Title" />
      <style backgroundColor="white"
             flex="1"
             id="Body" />
      <style 
             fontFamily="HKGrotesk-SemiBold"
             fontSize="16"
             id="Description"
             marginLeft="24"
             marginRight="24"
             marginTop="24"
             />

      <style id="Select"
        marginTop="24"
      />
      <style id="Select__Separator"
        borderTopWidth="1"
        borderTopColor="#e1e3e3"
        marginLeft="24"
        marginRight="24"
      />
      <style id="Select__Option"
        flex="1"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingLeft="24"
        paddingRight="24"
        paddingBottom="16"
        paddingTop="16"
      />
      <style id="Select__RadioOuter"
        width="20"
        height="20"
        borderRadius="10"
        borderWidth="1"
        borderColor="#bdc4c4"
      >
        <modifier pressed="true">
          <style borderColor="#8d9494" borderWidth="1" />
        </modifier>
        <modifier selected="true">
          <style borderColor="#4778ff" borderWidth="2" />
        </modifier>
      </style>

      <style id="Select__RadioInner"
        width="10"
        height="10"
        borderRadius="5"
        opacity="0"
        marginTop="3"
        marginLeft="3"
      >
        <modifier selected="true">
          <style backgroundColor="#4778ff" opacity="1" />
        </modifier>
      </style>

      <style id="Select__Label"
             fontFamily="HKGrotesk-Regular"
             color="#4e4d4d"
             fontSize="16"
             lineHeight="18"
      >
        <modifier selected="true">
          <style color="#312f2f" />
        </modifier>
        <modifier pressed="true">
          <style color="#312f2f" />
        </modifier>
      </style>

      <style id="SelectCustom"
        flex="1"
        flexDirection="row"
        marginLeft="24"
        marginRight="24"
        marginBottom="40"
        marginTop="24"
      />
      <style id="SelectCustom__Option"
        flex="1"
        justifyContent="flex-start"
        alignItems="center"
        borderRadius="4"
        borderWidth="1"
        borderColor="#BDC4C4"
        padding="16"
        marginRight="8"
      >
        <modifier selected="true">
          <style borderColor="#4778FF" />
        </modifier>
      </style>
      <style id="SelectCustom__Label"
             fontFamily="HKGrotesk-Regular"
             color="#4e4d4d"
             fontSize="16"
             lineHeight="18"
             textAlign="center"
      >
        <modifier selected="true">
          <style color="#4778FF" fontFamily="HKGrotesk-Medium" />
        </modifier>
      </style>

      <style id="SelectCustom__ImageWrapper" marginBottom="8" width="32" height="32" />
      <style id="SelectCustom__Image" width="32" height="32" position="absolute" top="0" left="0">
      <style id="SelectCustom__Image--Unselected">
        <modifier selected="true">
          <style width="0" height="0" />
        </modifier>
      </style>
      <style id="SelectCustom__Image--Selected" width="0" height="0">
        <modifier selected="true">
          <style width="32" height="32" />
        </modifier>
      </style>
    </styles>

    <body style="Body">
      <header style="Header">
        <text action="back"
              href="#"
              style="Header__Back">Back</text>
        <text style="Header__Title">Select Single</text>
      </header>
      <view scroll="true" style="Main">

        <text style="Description">Simple Select</text>
        <select-single style="Select" name="choice">
          <view style="Select__Separator" />
          <option style="Select__Option" value="paid_parking">
            <text style="Select__Label">Paid parking</text>
            <view style="Select__RadioOuter"><view style="Select__RadioInner"></view></view>
          </option>
          <view style="Select__Separator" />
          <option style="Select__Option" value="free_parking">
            <text style="Select__Label">Free parking</text>
            <view style="Select__RadioOuter"><view style="Select__RadioInner"></view></view>
          </option>
          <view style="Select__Separator" />
          <option style="Select__Option" value="unknown_parking">
            <text style="Select__Label">Unknown</text>
            <view style="Select__RadioOuter"><view style="Select__RadioInner"></view></view>
          </option>
          <view style="Select__Separator" />
        </select-single>

        <text style="Description">Pre-selected</text>
        <select-single style="Select" name="choice">
          <view style="Select__Separator" />
          <option style="Select__Option" value="paid_parking">
            <text style="Select__Label">Paid parking</text>
            <view style="Select__RadioOuter"><view style="Select__RadioInner"></view></view>
          </option>
          <view style="Select__Separator" />
          <option style="Select__Option" value="free_parking" selected="true">
            <text style="Select__Label">Free parking</text>
            <view style="Select__RadioOuter"><view style="Select__RadioInner"></view></view>
          </option>
          <view style="Select__Separator" />
          <option style="Select__Option" value="unknown_parking">
            <text style="Select__Label">Unknown</text>
            <view style="Select__RadioOuter"><view style="Select__RadioInner"></view></view>
          </option>
          <view style="Select__Separator" />
        </select-single>

        <text style="Description">Custom</text>
        <select-single style="SelectCustom" name="choice">
          <option style="SelectCustom__Option" value="paid_parking">
            <view style="SelectCustom__ImageWrapper">
              <image style="SelectCustom__Image SelectCustom__Image--Unselected" source="/ui_elements/forms/unselected.png" />
              <image style="SelectCustom__Image SelectCustom__Image--Selected" source="/ui_elements/forms/selected.png" />
            </view>
            <text style="SelectCustom__Label">Paid parking</text>
          </option>
          <option style="SelectCustom__Option" value="free_parking" selected="true">
            <view style="SelectCustom__ImageWrapper">
              <image style="SelectCustom__Image SelectCustom__Image--Unselected" source="/ui_elements/forms/unselected.png" />
              <image style="SelectCustom__Image SelectCustom__Image--Selected" source="/ui_elements/forms/selected.png" />
            </view>
            <text style="SelectCustom__Label">Free parking</text>
          </option>
          <option style="SelectCustom__Option" value="unknown_parking">
            <view style="SelectCustom__ImageWrapper">
              <image style="SelectCustom__Image SelectCustom__Image--Unselected" source="/ui_elements/forms/unselected.png" />
              <image style="SelectCustom__Image SelectCustom__Image--Selected" source="/ui_elements/forms/selected.png" />
            </view>
            <text style="SelectCustom__Label">Unknown</text>
          </option>
        </select-single>

      </view>
    </body>
  </screen>
</doc>
`,
  'hyperview/src/components/hv-spinner/stories/basic.xml':
  `<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <styles>
      <style id="Body"
        backgroundColor="white"
        flex="1"
      />
    </styles>
    <body style="Body">
      <spinner />
    </body>
  </screen>
</doc>
`,
  'hyperview/src/components/hv-spinner/stories/colored.xml':
  `<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <styles>
      <style id="Body"
        backgroundColor="white"
        flex="1"
      />
    </styles>
    <body style="Body">
      <spinner color="red" />
    </body>
  </screen>
</doc>
`,
  'hyperview/src/components/hv-switch/stories/basic.xml':
  `<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <styles>
      <style
        id="Body"
        backgroundColor="white"
        flex="1"
      />
      <style
        id="switch"
        backgroundColor="#E1E1E1"
      >
        <modifier selected="true">
          <style backgroundColor="#4778FF" />
        </modifier>
      </style>
    </styles>
    <body style="Body">
      <switch style="switch" name="switch1" value="on" />
    </body>
  </screen>
</doc>
`,
  'hyperview/src/components/hv-text-area/stories/basic.xml':
  `<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <styles>
      <style alignItems="center"
             backgroundColor="white"
             borderBottomColor="#eee"
             borderBottomWidth="1"
             flexDirection="row"
             height="72"
             id="Header"
             paddingLeft="24"
             paddingRight="24"
             paddingTop="24" />
      <style color="blue"
             fontFamily="HKGrotesk-SemiBold"
             fontSize="16"
             id="Header__Back"
             paddingRight="16" />
      <style color="black"
             fontFamily="HKGrotesk-SemiBold"
             fontSize="24"
             id="Header__Title" />
      <style backgroundColor="white"
             flex="1"
             id="Body" />
      <style borderColor="red"
             borderRadius="4"
             borderWidth="2"
             fontFamily="HKGrotesk-SemiBold"
             fontSize="16"
             id="Description"
             margin="24"
             padding="16" />
      <style flex="1"
             id="FormGroup"
             marginLeft="24"
             marginRight="24"
             marginTop="48" />
      <style flex="1"
             flexDirection="row"
             id="horizontalFormGroup" />
      <style flex="1"
             id="outerInput" />
      <style borderBottomColor="#E1E1E1"
             borderBottomWidth="1"
             borderColor="#4E4D4D"
             flex="1"
             fontFamily="HKGrotesk-Regular"
             fontSize="16"
             id="input"
             paddingBottom="8"
             paddingTop="8">

        <modifier focused="true">
          <style borderBottomColor="#4778FF" />
        </modifier>
      </style>
      <style borderBottomColor="#FF4847"
             color="#FF4847"
             id="input--error"
      > 
        <modifier focused="true">
          <style borderBottomColor="#FF4847" />
        </modifier>
      </style>
      <style borderColor="#4E4D4D"
             fontFamily="HKGrotesk-Bold"
             fontSize="16"
             id="label"
             lineHeight="24"
             marginBottom="8" />
      <style borderColor="#FF4847"
             fontFamily="HKGrotesk-Regular"
             fontSize="16"
             id="help"
             lineHeight="24"
             marginTop="16" />
      <style color="#FF4847"
             id="help--error" />
      <style flex="1"
             id="Main" />
    </styles>
    <body style="Body">
      <header style="Header">
        <text action="back"
              href="#"
              style="Header__Back">Back</text>
        <text style="Header__Title">Textarea</text>
      </header>
      <view scroll="true"
            style="Main">
        <view style="FormGroup">
          <text style="label">Multi-line text-area</text>
          <text-area
            placeholder="Instructions"
            placeholderTextColor="#8D9494"
            style="input">
          <text style="help">Please enter your gig instructions</text>
          </text-area>
        </view>
        <view style="FormGroup">
          <text style="label">Multi-line filled</text>
          <text-area
            placeholder="Instructions"
            placeholderTextColor="#8D9494"
            style="input" value="One
two
three
four">
          </text-area>
        </view>
        <view style="FormGroup">
          <text style="label">Multi-line validation error</text>
          <text-area
            placeholder="Instructions"
            placeholderTextColor="#8D9494"
            style="input input--error">
          </text-area>
          <text style="help help--error">Please enter your gig instructions</text>
        </view>
        <view style="FormGroup">
          <text style="label">Multi-line filled with validation error</text>
          <text-area
            placeholder="Instructions"
            placeholderTextColor="#8D9494"
            style="input input--error" value="One
two
three
four">
          </text-area>
          <text style="help help--error">Please enter your gig instructions</text>
        </view>
      </view>
    </body>
  </screen>
</doc>
`,
  'hyperview/src/components/hv-text-field/stories/basic.xml':
  `<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <styles>
      <style alignItems="center"
             backgroundColor="white"
             borderBottomColor="#eee"
             borderBottomWidth="1"
             flexDirection="row"
             height="72"
             id="Header"
             paddingLeft="24"
             paddingRight="24"
             paddingTop="24" />
      <style color="blue"
             fontFamily="HKGrotesk-SemiBold"
             fontSize="16"
             id="Header__Back"
             paddingRight="16" />
      <style color="black"
             fontFamily="HKGrotesk-SemiBold"
             fontSize="24"
             id="Header__Title" />
      <style backgroundColor="white"
             flex="1"
             id="Body" />
      <style borderColor="red"
             borderRadius="4"
             borderWidth="2"
             fontFamily="HKGrotesk-SemiBold"
             fontSize="16"
             id="Description"
             margin="24"
             padding="16" />
      <style flex="1"
             id="FormGroup"
             marginLeft="24"
             marginRight="24"
             marginTop="48" />
      <style flex="1"
             flexDirection="row"
             id="horizontalFormGroup" />
      <style flex="1"
             id="outerInput" />
      <style borderBottomColor="#E1E1E1"
             borderBottomWidth="1"
             borderColor="#4E4D4D"
             flex="1"
             fontFamily="HKGrotesk-Regular"
             fontSize="16"
             id="input"
             paddingBottom="8"
             paddingTop="8" />

        <modifier pressed="true">
          <style borderBottomColor="green" />
        </modifier>
        <modifier focused="true">
          <style borderBottomColor="#4778FF" />
        </modifier>
      </style>
      <style borderBottomColor="#FF4847"
             color="#FF4847"
             id="input--error"
      > 
        <modifier focused="true">
          <style borderBottomColor="#FF4847" />
        </modifier>
      </style>
      <style borderColor="#4E4D4D"
             fontFamily="HKGrotesk-Bold"
             fontSize="16"
             id="label"
             lineHeight="24"
             marginBottom="8" />
      <style borderColor="#FF4847"
             fontFamily="HKGrotesk-Regular"
             fontSize="16"
             id="help"
             lineHeight="24"
             marginTop="16" />
      <style color="#FF4847"
             id="help--error" />
      <style flex="1"
             id="Main"
             marginBottom="40" />
    </styles>
    <body style="Body">
      <header style="Header">
        <text action="back"
              href="#"
              style="Header__Back">Back</text>
        <text style="Header__Title">Text Input</text>
      </header>
      <view scroll="true"
            style="Main">

        <view style="FormGroup">
            <text style="label">Default input field</text>
            <text-field
                 placeholder="First name"
                 placeholderTextColor="#8D9494"
                 style="input"
            />
            <text style="help">Please enter your full name</text>
        </view>
        <view style="FormGroup">
            <text style="label">Filled input field</text>
            <text-field style="input" value="Milhouse" placeholder="First name" placeholderTextColor="#8D9494" />
            <text style="help">Please enter your full name</text>
        </view>
        <view style="FormGroup">
          <text style="label">Validation error</text>
          <text-field style="input input--error" placeholder="First name" placeholderTextColor="#8D9494" />
          <text style="help help--error">Please enter your full name</text>
        </view>
        <view style="FormGroup">
            <text style="label">Filled validation error</text>
            <text-field 
                 placeholder="First name"
                 placeholderTextColor="#8D9494"
                 style="input input--error"
                 value="Milhouse" />
            <text style="help help--error">Name already taken</text>
        </view>
        <view style="FormGroup">
          <text style="label">Horizontal Layout</text>
          <view style="horizontalFormGroup">
            <text-field
                   placeholder="First"
                   placeholderTextColor="#8D9494"
                   style="input" />
            <text-field
                   placeholder="Last"
                   placeholderTextColor="#8D9494"
                   style="input" />
          </view>
        </view>

        <view style="FormGroup">
            <text style="label">Phone pad keyboard</text>
            <text-field 
                 keyboard-type="phone-pad"
                 placeholder="Phone number"
                 placeholderTextColor="#8D9494"
                 style="input"
                 value="(281) 555-2048" />
        </view>

        <view style="FormGroup">
            <text style="label">Number pad keyboard</text>
            <text-field 
                 keyboard-type="number-pad"
                 placeholder="SSN"
                 placeholderTextColor="#8D9494"
                 style="input"
                 value="600 80 5555" />
        </view>

        <view style="FormGroup">
            <text style="label">Email keyboard</text>
            <text-field 
                 keyboard-type="email-address"
                 placeholder="Email"
                 placeholderTextColor="#8D9494"
                 style="input"
                 value="gigsy@instawork.com" />
        </view>

        <view style="FormGroup">
            <text style="label">Phone number mask</text>
            <text-field 
                 keyboard-type="phone-pad"
                 mask="(999) 999-9999"
                 placeholder="Phone number"
                 placeholderTextColor="#8D9494"
                 style="input"
                 value="" />
        </view>

        <view style="FormGroup">
            <text style="label">4 digit code mask</text>
            <text-field 
                 keyboard-type="number-pad"
                 mask="9999"
                 placeholder="4-digit code"
                 placeholderTextColor="#8D9494"
                 style="input"
                 value="" />
        </view>

        <view style="FormGroup">
            <text style="label">SSN mask</text>
            <text-field 
                 keyboard-type="number-pad"
                 mask="999 99 9999"
                 placeholder="SSN or Tax ID"
                 placeholderTextColor="#8D9494"
                 style="input"
                 value="" />
        </view>

      </view>
    </body>
  </screen>
</doc>
`,
  'hyperview/src/components/hv-text/stories/basic.xml':
  `<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <styles>
      <style id="Header"
             alignItems="center"
             backgroundColor="white"
             borderBottomColor="#eee"
             borderBottomWidth="1"
             flexDirection="row"
             height="72"
             paddingLeft="24"
             paddingRight="24"
             paddingTop="24" />
      <style id="Header__Back"
             color="blue"
             fontSize="16"
             fontWeight="600"
             paddingRight="16" />
      <style id="Header__Title"
             color="black"
             fontSize="24"
             fontWeight="600" />
      <style id="Body"
             backgroundColor="white"
             flex="1" />
      <style id="Description"
             fontSize="16"
             fontWeight="normal"
             margin="24"
             marginBottom="0" />
      <style id="Item"
             alignItems="center"
             borderBottomColor="#eee"
             borderBottomWidth="1"
             flex="1"
             flexDirection="row"
             height="48"
             justifyContent="space-between"
             paddingLeft="24"
             paddingRight="24" />
      <style id="Item__Label"
             fontSize="18"
             fontWeight="normal" />
      <style id="Item__Chevron"
             fontSize="18"
             fontWeight="bold" />
      <style id="Basic"
             fontSize="24"
             fontWeight="500"
             margin="24" />
      <style id="Bold"
             fontSize="16"
             fontWeight="bold"
             margin="24" />
      <style id="Color"
             backgroundColor="#63CB76"
             color="white"
             fontSize="32"
             fontWeight="bold"
             margin="24"
             padding="16" />
      <style id="Main"
             flex="1" />
    </styles>
    <body style="Body">
      <header style="Header">
        <text action="back"
              href="#"
              style="Header__Back">Back</text>
        <text style="Header__Title">Text</text>
      </header>
      <view scroll="true"
            style="Main">
        <text style="Description">Text</text>
        <text style="Basic">Hello, world!</text>
        <text style="Description">Nested Text</text>
        <text style="Basic">Hello,
        <text style="Bold">World of
        <text style="Color">HyperView!</text></text></text>
        <text style="Basic">
<![CDATA[Escaped with <![CDATA[]>: <hello><world>]]>
        </text>
      </view>
    </body>
  </screen>
</doc>
`,
  'hyperview/src/components/hv-view/stories/basic.xml':
  `<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <styles>
      <style id="Header"
             alignItems="center"
             backgroundColor="white"
             borderBottomColor="#eee"
             borderBottomWidth="1"
             flexDirection="row"
             height="72"
             paddingLeft="24"
             paddingRight="24"
             paddingTop="24" />
      <style id="Header__Back"
             color="blue"
             fontSize="16"
             fontWeight="600"
             paddingRight="16" />
      <style id="Header__Title"
             color="black"
             fontSize="24"
             fontWeight="600" />
      <style id="Body"
             backgroundColor="white"
             flex="1" />
      <style id="Description"
             fontSize="16"
             fontWeight="normal"
             margin="24"
             marginBottom="0" />
      <style id="Item"
             alignItems="center"
             borderBottomColor="#eee"
             borderBottomWidth="1"
             flex="1"
             flexDirection="row"
             height="48"
             justifyContent="space-between"
             paddingLeft="24"
             paddingRight="24" />
      <style id="Item__Label"
             fontSize="18"
             fontWeight="normal" />
      <style id="Item__Chevron"
             fontSize="18"
             fontWeight="bold" />
      <style id="Border"
             borderColor="#e1e1e1"
             borderWidth="1"
             flex="1"
             margin="24"
             padding="8" />
      <style id="Styled"
             backgroundColor="#63CB76"
             borderRadius="16"
             height="40" />
      <style id="Flex"
             flex="1"
             flexDirection="row"
             justifyContent="space-between" />
      <style id="Flex__Child"
             width="40" />
      <style id="Main"
             flex="1" />
    </styles>
    <body style="Body">
      <header style="Header">
        <text action="back"
              href="#"
              style="Header__Back">Back</text>
        <text style="Header__Title">View</text>
      </header>
      <view scroll="true"
            style="Main">
        <text style="Description">View</text>
        <view style="Border" />
        <text style="Description">Nested Views</text>
        <view style="Border">
          <view style="Border">
            <view style="Border" />
          </view>
        </view>
        <text style="Description">Styled</text>
        <view style="Border Styled" />
        <text style="Description">Flex</text>
        <view style="Border Flex">
          <view style="Flex__Child Styled" />
          <view style="Flex__Child Styled" />
          <view style="Flex__Child Styled" />
        </view>
      </view>
    </body>
  </screen>
</doc>
`,
  'hyperview/src/components/hv-view/stories/scrollview.xml':
  `<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <styles>
      <style id="Header"
             alignItems="center"
             backgroundColor="white"
             borderBottomColor="#eee"
             borderBottomWidth="1"
             flexDirection="row"
             height="72"
             paddingLeft="24"
             paddingRight="24"
             paddingTop="24" />
      <style id="Header__Back"
             color="blue"
             fontSize="16"
             fontWeight="600"
             paddingRight="16" />
      <style id="Header__Title"
             color="black"
             fontSize="24"
             fontWeight="600" />
      <style id="Body"
             backgroundColor="white"
             flex="1" />
      <style id="Description"
             fontSize="16"
             fontWeight="normal"
             margin="24"
             marginBottom="0" />
      <style id="Item"
             alignItems="center"
             borderBottomColor="#eee"
             borderBottomWidth="1"
             flex="1"
             flexDirection="row"
             height="48"
             justifyContent="space-between"
             paddingLeft="24"
             paddingRight="24" />
      <style id="Item__Label"
             fontSize="18"
             fontWeight="normal" />
      <style id="Item__Chevron"
             fontSize="18"
             fontWeight="bold" />
      <style id="Border"
             borderColor="#e1e1e1"
             borderWidth="1"
             flex="1"
             margin="24"
             padding="8" />
      <style id="Main"
             flex="1" />
      <style id="ScrollContainer"
             borderColor="#e1e1e1"
             borderRadius="16"
             borderWidth="1"
             height="160"
             margin="24" />
      <style id="ScrollContainer--Vertical"
             flexDirection="column" />
      <style id="ScrollContainer--Horizontal"
             flexDirection="row" />
      <style id="ScrollChild"
             backgroundColor="#63CB76"
             borderRadius="16"
             height="40"
             margin="8" />
      <style id="ScrollChild--Vertical"
             height="40" />
      <style id="ScrollChild--Horizontal"
             width="40" />
    </styles>
    <body style="Body">
      <header style="Header">
        <text action="back"
              href="#"
              style="Header__Back">Back</text>
        <text style="Header__Title">Scroll Views</text>
      </header>
      <view>
        <text style="Description">Vertical Scroll</text>
        <view scroll="true"
              style="ScrollContainer ScrollContainer--Vertical">
          <view style="ScrollChild ScrollChild--Vertical" />
          <view style="ScrollChild ScrollChild--Vertical" />
          <view style="ScrollChild ScrollChild--Vertical" />
          <view style="ScrollChild ScrollChild--Vertical" />
          <view style="ScrollChild ScrollChild--Vertical" />
          <view style="ScrollChild ScrollChild--Vertical" />
        </view>
        <text style="Description">Horizontal Scroll</text>
        <view scroll="true"
              scroll-orientation="horizontal"
              style="ScrollContainer ScrollContainer--Horizontal">
          <view style="ScrollChild ScrollChild--Horizontal" />
          <view style="ScrollChild ScrollChild--Horizontal" />
          <view style="ScrollChild ScrollChild--Horizontal" />
          <view style="ScrollChild ScrollChild--Horizontal" />
          <view style="ScrollChild ScrollChild--Horizontal" />
          <view style="ScrollChild ScrollChild--Horizontal" />
          <view style="ScrollChild ScrollChild--Horizontal" />
        </view>
      </view>
    </body>
  </screen>
</doc>
`,
  'hyperview/src/components/hv-web-view/stories/basic.xml':
  `<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <body style="Body">
      <web-view
        url="https://hyperview.org"
        activity-indicator-color="blue"
        injected-java-script="alert('Hello Hyperview user!')"
      />
    </body>
  </screen>
</doc>
`,
};
