import * as Hyperview from 'core-mobile/test/helpers/hyperview';

export default {
  title: 'core-mobile/components/HyperviewFilter',
};

export const Default = Hyperview.render(`
<doc
  xmlns="https://hyperview.org/hyperview"
  xmlns:filter="https://instawork.com/hyperview-filter"
>
  <screen>
    <styles>
      <style id="flex-1" flex="1" />
      <style id="Item" borderBottomWidth="1" borderColor="#BDC4C4" padding="16" />
      <style id="Item__Label" fontSize="16" />
      <style id="Input" fontSize="16" borderWidth="1" borderColor="#BDC4C4" padding="16" />
    </styles>
    <body style="flex-1">
      <form style="flex-1">
        <filter:container filter:on-event="search" filter:on-param="search-term" filter:transform="lowercase">
          <list key="list">
            <item key="field" style="Item">
              <text-field name="search-term" style="Input" auto-focus="true" placeholder="Search">
                <behavior trigger="change" action="dispatch-event" event-name="search" />
              </text-field>
            </item>
            <item key="1" style="Item" filter:terms="Reagan Bennett,Reagan,Bennett,San Francisco,San,Francisco">
              <text style="Item__Label">Reagan Bennett</text>
              <text>San Francisco</text>
            </item>
            <item key="2" style="Item" filter:terms="Vicente Savage,Vicente,Savage,San,Jose,San Jose">
              <text style="Item__Label">Vicente Savage</text>
              <text>San Jose</text>
            </item>
            <item key="3" style="Item" filter:terms="Alanna,Powers,Burlingame">
              <text style="Item__Label">Alanna Powers</text>
              <text>Burlingame</text>
            </item>
            <item key="4" style="Item" filter:terms="Pablo,Hester">
              <text style="Item__Label">Pablo Hester</text>
            </item>
            <item key="5" style="Item" filter:terms="Sierra,Murphy">
              <text style="Item__Label">Sierra Murphy</text>
            </item>
            <item key="6" style="Item" filter:terms="Clark,Dawson">
              <text style="Item__Label">Clark Dawson</text>
            </item>
            <item key="7" style="Item" filter:terms="Marilyn,Reyes">
              <text style="Item__Label">Marilyn Reyes</text>
            </item>
            <item key="8" style="Item" filter:terms="Jerry,Wright">
              <text style="Item__Label">Jerry Wright</text>
            </item>
            <item key="9" style="Item" filter:terms="Madison,Peralta">
              <text style="Item__Label">Madison Peralta</text>
            </item>
            <item key="10" style="Item" filter:terms="Santos,Nelson">
              <text style="Item__Label">Santos Nelson</text>
            </item>
            <item key="11" style="Item" filter:terms="Nola,Woods">
              <text style="Item__Label">Nola Woods</text>
            </item>
            <item key="12" style="Item" filter:terms="Jeremy,Morton">
              <text style="Item__Label">Jeremy Morton</text>
            </item>
            <item key="13" style="Item" filter:terms="Ryann,Fowler">
              <text style="Item__Label">Ryann Fowler</text>
            </item>
            <item key="14" style="Item" filter:terms="Alfred,Santiago">
              <text style="Item__Label">Alfred Santiago</text>
            </item>
            <item key="15" style="Item" filter:terms="Rebekah,Acosta">
              <text style="Item__Label">Rebekah Acosta</text>
            </item>
            <item key="16" style="Item" filter:terms="Tobias,Russell">
              <text style="Item__Label">Tobias Russell</text>
            </item>
            <item key="17" style="Item" filter:terms="Harmony,Rocha">
              <text style="Item__Label">Harmony Rocha</text>
            </item>
            <item key="18" style="Item" filter:terms="Shawn,Bond">
              <text style="Item__Label">Shawn Bond</text>
            </item>
            <item key="19" style="Item" filter:terms="Malaysia,Campos">
              <text style="Item__Label">Malaysia Campos</text>
            </item>
            <item key="20" style="Item" filter:terms="Barrett,Li">
              <text style="Item__Label">Barrett Li</text>
            </item>
          </list>
        </filter:container>
      </form>
    </body>
  </screen>
</doc>
`);

export const Selectable = Hyperview.render(`
<doc
  xmlns="https://hyperview.org/hyperview"
  xmlns:filter="https://instawork.com/hyperview-filter"
>
  <screen>
    <styles>
      <style id="flex-1" flex="1" />
      <style id="mb-48" marginBottom="48" />
      <style id="Item" borderBottomWidth="1" borderColor="#BDC4C4" padding="16" />
      <style id="Item__Label" fontSize="16" />
      <style id="Input" fontSize="16" borderWidth="1" borderColor="#BDC4C4" margin="16" padding="16" />
      <style id="Search" backgroundColor="#FFFFFF" />
      <style id="Option" flexDirection="row" justifyContent="space-between" />
      <style id="Checkbox" alignSelf="center" borderWidth="1" borderColor="#BDC4C4" width="22" height="22">
        <modifier selected="true">
          <style backgroundColor="#4778ff" borderColor="white" />
        </modifier>
        <modifier pressed="true">
          <style backgroundColor="#4778ff" borderColor="white" />
        </modifier>
      </style>
      <style id="SectionHeader" padding="16" backgroundColor="#F5F5F5" fontSize="18" fontWeight="bold" paddingTop="24" />
      <style id="AddPosition" padding="16" />
      <style id="AddPosition__Label" fontSize="16" />
    </styles>
    <body style="flex-1">
      <form style="flex-1 mb-48">
        <filter:container filter:on-event="search" filter:on-param="search-term" filter:transform="lowercase">
          <view key="field" style="Search">
            <text-field id="search-term" name="search-term" style="Input" auto-focus="true" placeholder="Search">
              <behavior trigger="change" action="dispatch-event" event-name="search" />
            </text-field>
          </view>
          <select-multiple>
            <view scroll="true">
              <view key="custom" sticky="true">
                <text style="SectionHeader" filter:terms="%">
                  Custom positions you've added
                </text>
              </view>
              <view id="custom">
                <view key="custom-1" style="Item" filter:terms="Developer">
                  <option value="Developer" style="Option">
                    <text style="Item__Label">Developer</text>
                    <view style="Checkbox" />
                  </option>
                </view>
                <view key="custom-2" style="Item" filter:terms="Designer">
                  <option value="Designer" style="Option">
                    <text style="Item__Label">Designer</text>
                    <view style="Checkbox" />
                  </option>
                </view>
              </view>
              <view key="interest" sticky="true">
                <text style="SectionHeader" filter:terms="%">
                  Based on your interest
                </text>
              </view>
              <view key="1" style="Item" filter:terms="General labor">
                <option value="General labor" style="Option">
                  <text style="Item__Label">General labor</text>
                  <view style="Checkbox" />
                </option>
              </view>
              <view key="2" style="Item" filter:terms="Bartender">
                <option value="Bartender" style="Option" selected="true">
                  <text style="Item__Label">Bartender</text>
                  <view style="Checkbox" />
                </option>
              </view>
              <view key="3" style="Item" filter:terms="Barback">
                <option value="Barback" style="Option" selected="true">
                  <text style="Item__Label">Barback</text>
                  <view style="Checkbox" />
                </option>
              </view>
              <view key="4" style="Item" filter:terms="Retail merchandiser">
                <option value="Retail merchandiser" style="Option">
                  <text style="Item__Label">Retail merchandiser</text>
                  <view style="Checkbox" />
                </option>
              </view>
              <view key="5" style="Item" filter:terms="Temperature screener">
                <option value="Temperature screener" style="Option">
                  <text style="Item__Label">Temperature screener</text>
                  <view style="Checkbox" />
                </option>
              </view>
              <view key="6" style="Item" filter:terms="Brand ambassador">
                <option value="Brand ambassador" style="Option">
                  <text style="Item__Label">Brand ambassador</text>
                  <view style="Checkbox" />
                </option>
              </view>
              <view key="popular" sticky="true">
                <text style="SectionHeader" filter:terms="%">
                  Other popular positions
                </text>
              </view>
              <view key="7" style="Item" filter:terms="Warehouse Associate">
                <option value="Warehouse Associate" style="Option">
                  <text style="Item__Label">Warehouse Associate</text>
                  <view style="Checkbox" />
                </option>
              </view>
              <view key="8" style="Item" filter:terms="Event Setup and Takedown">
                <option value="Event Setup and Takedown" style="Option">
                  <text style="Item__Label">Event Setup and Takedown</text>
                  <view style="Checkbox" />
                </option>
              </view>
              <view key="9" style="Item" filter:terms="Custodial">
                <option value="Custodial" style="Option">
                  <text style="Item__Label">Custodial</text>
                  <view style="Checkbox" />
                </option>
              </view>
              <view key="10" style="Item" filter:terms="Counter Staff / Cashier">
                <option value="Counter Staff / Cashier" style="Option">
                  <text style="Item__Label">Counter Staff / Cashier</text>
                  <view style="Checkbox" />
                </option>
              </view>
              <view key="11" style="Item" filter:terms="Event Server">
                <option value="Event Server" style="Option">
                  <text style="Item__Label">Event Server</text>
                  <view style="Checkbox" />
                </option>
              </view>
              <view key="12" style="Item" filter:terms="Prep Cook">
                <option value="Prep Cook" style="Option">
                  <text style="Item__Label">Prep Cook</text>
                  <view style="Checkbox" />
                </option>
              </view>
              <view key="13" style="Item" filter:terms="Dishwasher">
                <option value="Dishwasher" style="Option">
                  <text style="Item__Label">Dishwasher</text>
                  <view style="Checkbox" />
                </option>
              </view>
              <view key="14" style="Item" filter:terms="Food Service Worker">
                <option value="Food Service Worker" style="Option">
                  <text style="Item__Label">Food Service Worker</text>
                  <view style="Checkbox" />
                </option>
              </view>
              <view key="15" style="Item" filter:terms="Runner">
                <option value="Runner" style="Option">
                  <text style="Item__Label">Runner</text>
                  <view style="Checkbox" />
                </option>
              </view>
              <view key="16" style="Item" filter:terms="Host / Reservationist">
                <option value="Host / Reservationist" style="Option">
                  <text style="Item__Label">Host / Reservationist</text>
                  <view style="Checkbox" />
                </option>
              </view>
              <view key="17" style="Item" filter:terms="Busser">
                <option value="Busser" style="Option">
                  <text style="Item__Label">Busser</text>
                  <view style="Checkbox" />
                </option>
              </view>
              <view key="18" style="Item" filter:terms="Merchandiser">
                <option value="Merchandiser" style="Option">
                  <text style="Item__Label">Merchandiser</text>
                  <view style="Checkbox" />
                </option>
              </view>
              <view key="19" style="Item" filter:terms="Food Service Worker">
                <option value="Food Service Worker" style="Option">
                  <text style="Item__Label">Food Service Worker</text>
                  <view style="Checkbox" />
                </option>
              </view>
              <view key="20" style="Item" filter:terms="Forklift Driver">
                <option value="Forklift Driver" style="Option">
                  <text style="Item__Label">Forklift Driver</text>
                  <view style="Checkbox" />
                </option>
              </view>
            </select-multiple>
          </view>
          <view hide="true" filter:regex=".*" style="AddPosition">
            <text style="AddPosition__Label">+ Add "<text filter:role="filter-terms" />"</text>
            <behavior action="set-value" target="search-term" new-value="" />
            <behavior action="append" target="custom" href="#custom-position" />
          </view>
        </filter:container>
      </form>
    </body>
  </screen>
</doc>
`);
