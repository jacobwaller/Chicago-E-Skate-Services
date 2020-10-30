const commands = [
  {
    commands: [
      "flashlight",
      "light",
      "flash_light",
      "torch",
      "torch_light",
      "flashlights",
      "lights",
      "torches",
    ],
    response:
      "https://www.amazon.com/gp/product/B017XD0PX8/ref=oh_aui_search_detailpage?ie=UTF8&psc=1 \n https://www.amazon.com/dp/B00T8J9FGO?ref=yo_pop_ma_swf \n https://www.amazon.com/dp/B01G75P1SC?ref=yo_pop_ma_swf \n https://www.amazon.com/dp/B071DHQDLD?ref=yo_pop_ma_swf \n https://www.amazon.com/dp/B01D5E93TG/ref=cm_sw_r_cp_api_i_02OPCb0B007PY \n https://www.amazon.com/dp/B01LX99PT4/ref=cm_sw_r_cp_apa_i_K7OPCbPSRT7YW",
  },
  {
    commands: ["sendit", "send_it"],
    response: "https://gph.is/2AxB2hE",
  },
  {
    commands: [
      "battery",
      "batteries",
      "replace_battery",
      "replacebattery",
      "batterys",
      "electron_holder",
    ],
    response: "https://www.youtube.com/watch?v=g-JsaT8N6rk",
  },
  {
    commands: [
      "pads",
      "owie",
      "kneepads",
      "elbowpads",
      "knee_pads",
      "elbow_pads",
      "armor",
      "i_dont_wanna_die",
    ],
    response:
      "https://g-form.com/\nhttps://www.revzilla.com/motorcycle/speed-and-strength-critical-mass-jeans\nhttps://www.revzilla.com/motorcycle/speed-and-strength-true-romance-womens-jeans\nhttps://www.amazon.com/dp/B00829IFWQ/ref=cm_sw_r_cp_apa_HBfBBbW8594ZH\nhttps://www.amazon.com/dp/B07735T8CC/ref=cm_sw_r_cp_apa_rCfBBbE1AF3A4",
  },
  {
    commands: [
      "wintergear",
      "winter",
      "cold",
      "its_cold_as_fuck_wtf",
      "chilly",
      "winter_gear",
      "its_cold_as_fuck",
    ],
    response:
      "https://www.revzilla.com/motorcycle/speed-and-strength-straight-savage-jacket\nhttps://www.revzilla.com/motorcycle/speed-and-strength-double-take-womens-jacket\nhttps://www.amazon.com/dp/B01H50RCY4/ref=cm_sw_r_cp_apa_LHfBBbBA59EA4\nhttps://www.amazon.com/dp/B01H50RDW0/ref=cm_sw_r_cp_apa_7HfBBbYREWEDV\nhttps://www.amazon.com/dp/B01E5PJ41G/ref=cm_sw_r_cp_apa_FIfBBb952B924\nhttps://www.amazon.com/dp/B075SJB7N1/ref=cm_sw_r_cp_apa_aJfBBbVQNWKG5\nhttps://www.revzilla.com/motorcycle/knox-hanbury-mk1-gloves\nhttps://www.vans.com/shop/sk8hi-mte",
  },
  {
    commands: [
      "bearing",
      "bearings",
      "bearing_change",
      "bearingchange",
      "change_bearings",
      "changebearings",
    ],
    response:
      "https://www.amazon.com/dp/B01MYG7WT0/ref=cm_sw_r_cp_apa_mVdBBb5F203E4\nhttps://media.giphy.com/media/7zAgRCl0lkUSDNp6Y7/giphy.mp4",
  },
  {
    commands: [
      "charging",
      "charge",
      "charger",
      "charge_location",
      "charge_locations",
    ],
    response:
      "https://www.google.com/maps/d/edit?mid=1KIzwP95pZD0A3CWmjC6lcMD29f4&usp=sharing",
  },
  {
    commands: ["helpful_links", "links", "link", "helpfullinks"],
    response:
      "Charging Map: https://www.google.com/maps/d/edit?mid=1KIzwP95pZD0A3CWmjC6lcMD29f4&usp=sharing\nBoosted Board Riders Chicago: https://www.facebook.com/groups/BoostedCHI\nChicago E-Skate: https://www.facebook.com/groups/chicagoeskate/\nAnnouncement Telegram: https://t.me/joinchat/AAAAAEwbHWf-hVIT53a75Q \n Telegram Invite Link: https://t.me/joinchat/GtOvohDOaknaq_0JfboLJg\n Strava Group: https://www.strava.com/clubs/boostedchi",
  },
  {
    commands: ["helmet", "helmets", "helmet_recommendations", "brain_bucket"],
    response:
      "http://www.bernunlimited.com/\nhttps://www.explorethousand.com/\nhttps://www.ruroc.com/en/\nhttps://shop.boostedboards.com/products/boosted-helmet\nhttps://www.pocsports.com/us/cycling-helmets/commuter/\nhttps://www.youtube.com/watch?v=b9yL5usLFgY",
  },
  {
    commands: ["belts", "belt"],
    response:
      "Boosted Board belts are 225-3M-15\nThey can be purchased from: \nhttps://skatekastle.com/shop/ols/products/xn-gates-powergrip-htd-belt-set-boosted-board-9zb\nhttps://www.rompsupply.com/products/boosted-board-belt-v2?variant=28228785537104\nhttps://www.amazon.com/s?k=boosted+board+belts",
  },
  {
    commands: ["nosedive"],
    response: "ayy lmao\nhttps://www.youtube.com/watch?v=kc6IEVV9mp0",
  },
  {
    commands: ["milk", "milked"],
    response: "https://www.instagram.com/p/BW0r8wrlSMJ/",
  },
  {
    commands: ["rule", "rules", "guideline", "guidelines", "law", "laws"],
    response:
      "For more information on the rules, visit: http://bit.ly/CHIesk8Rules\n\n1. Wear a helmet.\n2. Seriously, wear a helmet.\n3. Keep a safe following distance.\n4. Stagger yourselves while riding.\n5. Wear clothing that wont fly off or get caught in wheels.\n6. Don't blind people with your flashlight.\n7. Watch where you shine your flashlight.\n8. Ride responsibly.\n9. Be a team player.\n10. Communicate.\n11. Come prepared.\n12. Obey traffic signals.\n13. Excersise caution.\n14. Ride Defensively.\n15. Avoide Road Rage.\n16. Keep some form of emergency contact info on your person.\n17. Do not ride drunk.\n18. No spamming.\n19. Be honest with transactions.",
  },
  {
    commands: ["strava"],
    response:
      "Track your miles and share your routes! Join Boosted Chicago on Strava by visiting:\nhttps://www.strava.com/clubs/boostedchi",
  },
  {
    commands: ["tire", "tires"],
    response:
      "Onewheel Tire Information:\nhttps://www.hoosiertire.com/\nhttp://vegausa.com/\nhttps://burrisracing.com/\nhttps://www.dunloptires.com/\nFor tire upcycling, DM: @tire_sire",
  },
  {
    commands: [
      "dirttrack",
      "dirt_track",
      "track",
      "the_garden",
      "thegarden",
      "trackrules",
      "track_rules",
    ],
    response:
      "Counter Clockwise ONLY.\nUp to three people riding together at a time.\nYield to bike riders.\nNo BBQ on the grounds. It's okay in the parking lot.\nTake out what you bring in. Be responsible.\nPatch up any divots you make in the track.\n",
  },
  {
    commands: [
      "errors",
      "error",
      "codes",
      "code",
      "errorcode",
      "error_code",
      "errorcodes",
      "error_codes",
    ],
    response:
      "Boosted Board XR Battery Error Codes:\nhttps://bit.ly/BoostedServiceManual",
  },
];

module.exports = { commands };
