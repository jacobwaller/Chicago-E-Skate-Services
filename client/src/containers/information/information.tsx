import React from "react";
import { Collapse } from "antd";
const { Panel } = Collapse;

const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

const about = (
  <>
    <p>
      Founded in 2017, we are dedicated to all forms of PEV's from esk8's to
      ebikes &amp; everything in between.
    </p>
    <p>
      Consisting of more than 900 members across the Chicagoland area, we
      connect riders with each other in order to ride &amp; discuss PEV's of all
      types.
    </p>
    <p>
      We host group rides regularly. Make new friends &amp; explore new places!
    </p>
  </>
);

const rules = (
  <ul>
    <li>1. Wear a helmet.</li>
    <li>2. Seriously, wear a helmet.</li>
    <li>3. Keep a safe following distance.</li>
    <li>4. Stagger yourselves while riding.</li>
    <li>5. Wear clothing that wont fly off or get caught in wheels.</li>
    <li>6. Don't blind people with your flashlight.</li>
    <li>7. Watch where you shine your flashlight.</li>
    <li>8. Ride responsibly.</li>
    <li>9. Be a team player.</li>
    <li>10. Communicate.</li>
    <li>11. Come prepared.</li>
    <li>12. Obey traffic signals.</li>
    <li>13. Excersise caution.</li>
    <li>14. Ride Defensively.</li>
    <li>15. Avoide Road Rage.</li>
    <li>16. Keep some form of emergency contact info on your person.</li>
    <li>17. Do not ride drunk.</li>
    <li>18. No spamming.</li>
    <li>19. Be honest with transactions.</li>
  </ul>
);

const info = (
  <>
    <p>Telegram Chats:</p>
    <a href="https://t.me/joinchat/IpygA1Fe8katyls34TYaYg">
      Main Chicago E-Skate Chat
    </a>
    <br />
    <br />
    <p> Subgroups:</p>
    <a href="https://t.me/joinchat/GGTLCBGKcqVJxoLM58E9MA">
      Chicago E-Bike Community
    </a>
    <br />
    <a href="https://t.me/joinchat/KVjiJBwwz5YOwDJvBxX5ww">Chicago EUC</a>
    <br />
    <a href="https://t.me/joinchat/IpygA05s_fmnsPahsoLa4g">Chicago Onewheel</a>
    <br />
    <a href="https://t.me/joinchat/IpygAxxTFUuTxKL_Gu1wVQ">
      Chicago Electric Scooters
    </a>
    <br />
    <br />

    <p> FB Groups:</p>

    <a href="https://www.facebook.com/groups/chicagoeskate/?ref=share">
      Chicago E-Skate:
    </a>
    <br />
    <a href="https://www.facebook.com/groups/chicagoonewheel/?ref=share">
      Chicago Onewheel
    </a>
    <br />
    <a href="https://www.facebook.com/groups/665412891024870/?ref=share">
      Chicago E-Bike Community:
    </a>
  </>
);

export function Information() {
  return (
    <Collapse accordion>
      <Panel className="panel" showArrow={false} header="About Us" key={1}>
        {about}
      </Panel>
      <Panel className="panel" showArrow={false} header="Rules" key={2}>
        {rules}
      </Panel>
      <Panel
        className="panel"
        showArrow={false}
        header="More Information"
        key={3}
      >
        {info}
      </Panel>
    </Collapse>
  );
}
