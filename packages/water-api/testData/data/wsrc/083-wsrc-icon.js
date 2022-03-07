const dataUtil = require('ra-loopback3/server/utils/data');
const { mapSeries } = require('async');
const data = [
  {
    id: 'LocalDrop-factory_icon-64-normal-svg',
    color: 'normal',
    data:
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">\n  <svg class="dropIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><style> svg.dropIcon {fill: #3f51b5;} </style>\n  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7"/>\n  <path d="M0 0h24v24H0z" fill="none"/>\n</svg>\n  <svg x="6" y="4" class="factoryIcon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><style> svg.factoryIcon {fill: white;} </style><path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>\n\t%s\n\t<path d="M0 0h24v24H0z" fill="none"/>\n</svg>',
    name: 'factory_normal_icon',
    format: 'svg',
    size: '64',
    type: 'Local',
  },
  {
    id: 'LocalDrop-water_source_icon-64-alert-svg',
    color: 'alert',
    data:
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">\n  <svg class="dropIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><style> svg.dropIcon {fill: #fbc02d;} </style>\n  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7"/>\n  <path d="M0 0h24v24H0z" fill="none"/>\n</svg>\n  <svg x="6" y="4" class="filterIcon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><style> svg.filterIcon {fill: white;} </style><path d="M0 0h24v24H0z" fill="none"/><path d="M15.96 10.29l-2.75 3.54-1.96-2.36L8.5 15h11l-3.54-4.71zM3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5zm18-4H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 16H7V3h14v14z"/></svg>\n\t%s\n\t<path d="M0 0h24v24H0z" fill="none"/>\n</svg>',
    format: 'svg',
    name: 'water_source_alert_icon',
    size: '64',
    type: 'Local',
  },
  {
    id: 'LocalDrop-water_source_icon-64-critical-svg',
    color: 'critical',
    data:
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">\n  <svg class="dropIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><style> svg.dropIcon {fill: #a31545;} </style>\n  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7"/>\n  <path d="M0 0h24v24H0z" fill="none"/>\n</svg>\n  <svg x="6" y="4" class="filterIcon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><style> svg.filterIcon {fill: white;} </style><path d="M0 0h24v24H0z" fill="none"/><path d="M15.96 10.29l-2.75 3.54-1.96-2.36L8.5 15h11l-3.54-4.71zM3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5zm18-4H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 16H7V3h14v14z"/></svg>\n\t%s\n\t<path d="M0 0h24v24H0z" fill="none"/>\n</svg>',
    format: 'svg',
    name: 'water_source_critical_icon',
    size: '64',
    type: 'Local',
  },
  {
    id: 'LocalDrop-water_source_icon-64-normal-svg',
    color: 'normal',
    data:
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">\n  <svg class="dropIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><style> svg.dropIcon {fill:#3f51b5;} </style>\n  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7"/>\n  <path d="M0 0h24v24H0z" fill="none"/>\n</svg>\n  <svg x="6" y="4" class="filterIcon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><style> svg.filterIcon {fill: white;} </style><path d="M0 0h24v24H0z" fill="none"/><path d="M15.96 10.29l-2.75 3.54-1.96-2.36L8.5 15h11l-3.54-4.71zM3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5zm18-4H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 16H7V3h14v14z"/></svg>\n\t%s\n\t<path d="M0 0h24v24H0z" fill="none"/>\n</svg>',
    format: 'svg',
    name: 'water_source_normal_icon',
    size: '64',
    type: 'Local',
  },
  {
    id: 'LocalDrop-meter_icon-64-normal-svg',
    color: 'normal',
    data:
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">\n  <svg class="dropIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><style> svg.dropIcon {fill: #3f51b5;} </style>\n  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7"/>\n  <path d="M0 0h24v24H0z" fill="none"/>\n</svg>\n  <svg x="6" y="4" class="meterIcon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 1000 1000"><style> svg.meterIcon {fill: white;} </style>\n  <g>\n    <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">\n      <path d="M4579.1,4377.9c-940-78.1-1921.5-473.7-2658.9-1074.3C677.5,2287.9-15.9,688.7,115.9-861.7c102.6-1198.8,556.7-2212.1,1364.8-3039.8c210-214.9,268.6-263.7,327.2-263.7c134.3,0,258.8,100.1,507.8,415.1c58.6,73.2,275.9,305.2,478.5,512.7c205.1,207.5,385.8,410.2,398,446.8c68.4,178.3-4.9,385.8-168.5,478.6c-100.1,56.2-263.7,68.4-349.1,24.4c-29.3-14.7-202.7-175.8-383.3-354l-332.1-329.6l-51.3,56.2c-100.1,107.4-322.3,461.5-429.7,686.1c-185.6,378.4-310.1,796-368.7,1215.9l-17.1,114.7l459,7.3c512.7,9.7,573.8,29.3,683.6,190.4c87.9,129.4,95.2,227.1,29.3,361.3c-109.9,217.3-205.1,249-786.2,251.5H1095l14.7,105c26.9,192.9,156.3,688.5,229.5,883.9c97.7,251.5,293,617.7,437,815.5c61,87.9,119.6,170.9,129.4,183.1c9.8,14.6,146.5-102.5,329.6-283.2c210-207.5,336.9-315,385.8-324.7c41.5-9.8,85.5-19.5,102.6-24.4c61-19.5,217.3,43.9,295.4,117.2c92.8,90.3,136.7,224.6,112.3,354c-12.2,73.3-73.2,148.9-329.6,407.8c-173.4,175.8-315,327.2-315,339.4c0,51.3,468.8,371.1,756.9,512.7c354,178.2,820.4,329.6,1135.3,368.7c68.4,9.8,141.6,22,163.6,26.9c36.6,9.8,41.5-31.7,48.8-451.7c7.3-424.8,12.2-468.8,58.6-532.3c180.7-241.7,522.5-239.3,661.7,7.3c51.3,87.9,56.2,124.5,56.2,542v446.8l117.2-14.6c529.8-75.7,1076.7-261.3,1501.6-515.2c214.9-129.4,429.7-285.7,432.2-315c0-14.7-127-151.4-283.2-305.2c-312.5-312.5-351.6-368.7-351.6-512.7c0-261.3,244.2-441.9,495.6-366.2c80.6,22,173.4,100.1,412.6,336.9l310.1,305.2l48.8-58.6c241.7-285.7,542-835,671.4-1230.6c75.7-234.4,158.7-605.5,161.1-713v-78.1l-468.8-7.3c-449.2-7.3-476.1-9.7-551.8-63.5c-236.8-170.9-210-534.7,53.7-661.7c92.8-46.4,148.9-51.3,549.4-51.3H8913l-17.1-127c-92.8-722.7-371.1-1384.4-830.1-1982.5c-34.2-46.4-53.7-31.8-373.6,283.2c-258.8,256.4-358.9,339.4-437.1,361.3c-144,43.9-263.7,14.7-378.4-95.2c-85.4-78.1-100.1-109.9-112.3-217.3c-4.9-68.4-2.5-153.8,4.9-190.4c12.2-41.5,219.7-273.5,549.4-605.5c290.5-297.9,549.4-568.9,573.8-605.5c56.2-87.9,234.4-173.3,315-153.8c78.1,19.5,520,473.7,708.1,725.1c976.6,1308.7,1245.2,2981.2,722.7,4521.8c-627.5,1850.7-2300,3152.1-4258.1,3310.8C5035.7,4407.2,4930.7,4407.2,4579.1,4377.9z" />\n      <path d="M6600.8,1155c-26.9-12.2-273.5-114.7-549.4-227.1C5170,569,4601.1,283.4,4405.8,105.1c-188-170.9-268.6-361.3-271-632.4c0-185.5,7.3-224.6,78.1-368.7c95.2-192.9,249-341.8,441.9-432.2c114.8-53.7,173.4-65.9,346.7-65.9c188,0,224.6,7.3,371.1,80.6c229.5,112.3,344.3,251.5,564,681.2c214.9,422.4,678.8,1491.8,759.3,1760.4C6715.5,1186.8,6686.2,1196.5,6600.8,1155z M5189.6-248.9c87.9-56.2,136.7-151.4,136.7-266.1c0-249-251.5-402.9-468.8-285.7c-163.6,87.9-219.7,295.4-117.2,446.8C4845.3-195.2,5038.2-151.2,5189.6-248.9z" />\n    </g>\n  </g>\n</svg>\n\t%s\n\t<path d="M0 0h24v24H0z" fill="none"/>\n</svg>',
    name: 'meter_normal_icon',
    size: '64',
    type: 'Local',
  },
  {
    id: 'LocalDrop-data_logger_icon-64-normal-svg',
    color: 'normal',
    data:
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">\n  <svg class="dropIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><style> svg.dropIcon {fill: #3f51b5;} </style>\n  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7"/>\n  <path d="M0 0h24v24H0z" fill="none"/>\n</svg>\n  <svg x="6" y="4" class="flowLoggerIcon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><style> svg.flowLoggerIcon {fill: white;} </style><path d="M0 0h24v24H0z" fill="none"/><path d="M15 9H9c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V10c0-.55-.45-1-1-1zm-3 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM7.05 6.05l1.41 1.41C9.37 6.56 10.62 6 12 6s2.63.56 3.54 1.46l1.41-1.41C15.68 4.78 13.93 4 12 4s-3.68.78-4.95 2.05zM12 0C8.96 0 6.21 1.23 4.22 3.22l1.41 1.41C7.26 3.01 9.51 2 12 2s4.74 1.01 6.36 2.64l1.41-1.41C17.79 1.23 15.04 0 12 0z"/></svg>\n\t%s\n\t<path d="M0 0h24v24H0z" fill="none"/>\n</svg>',
    name: 'data_logger_normal_icon',
    size: '64',
    type: 'Local',
  },
  {
    id: 'LocalDrop-sensor_icon-64-normal-svg',
    color: 'normal',
    data:
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">\n  <svg class="dropIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><style> svg.dropIcon {fill: #3f51b5;} </style>\n  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7"/>\n  <path d="M0 0h24v24H0z" fill="none"/>\n</svg>\n  <svg x="6" y="4" class="qualityLoggerIcon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 301.605 301.605"><style> svg.qualityLoggerIcon {fill: white;} </style>\n  <path d="M236.896,38.375v12.854h-49.808V38.375H236.896z M216.009,66.389h-28.921v12.854h28.921V66.389z M187.088,107.257h49.808\n\t\tV94.404h-49.808V107.257z M216.009,122.425h-28.921v12.854h28.921V122.425z M187.088,163.293h49.808v-12.854h-49.808V163.293z\n\t\t M194.852,236.533c0,35.881-29.191,65.072-65.072,65.072s-65.072-29.191-65.072-65.072c0-23.252,12.211-44.384,32.134-56.074\n\t\tV32.938C96.843,14.775,111.618,0,129.78,0s32.938,14.775,32.938,32.938v147.522C182.641,192.137,194.852,213.275,194.852,236.533z\n\t\t M181.998,236.533c0-19.73-10.964-37.565-28.619-46.53l-3.515-1.787V32.944c0-11.08-9.01-20.084-20.084-20.084\n\t\tc-11.073,0-20.084,9.004-20.084,20.084v155.272l-3.515,1.787c-17.655,8.972-28.619,26.806-28.619,46.53\n\t\tc0,28.792,23.426,52.218,52.218,52.218S181.998,265.325,181.998,236.533z M171.291,236.533c0,22.886-18.619,41.505-41.511,41.505\n\t\tc-22.886,0-41.505-18.619-41.505-41.505c0-18.76,12.674-35.232,30.823-40.058l2.384-0.636V52.97h16.601v142.862l2.384,0.643\n\t\tC158.624,201.301,171.291,217.78,171.291,236.533z M131.837,208.866c-0.99-4.396-5.411-7.288-9.917-6.26\n\t\tc-15.733,3.56-26.723,17.32-26.723,33.465c0,4.569,3.721,8.291,8.291,8.291s8.291-3.721,8.291-8.291\n\t\tc0-8.207,5.797-15.482,13.798-17.288C130.024,217.76,132.839,213.313,131.837,208.866z" />\n</svg>\n\t%s\n\t<path d="M0 0h24v24H0z" fill="none"/>\n</svg>',
    name: 'sensor_normal_icon',
    size: '64',
    type: 'Local',
  },
  {
    id: 'LocalDrop-pump_icon-64-normal-svg',
    color: 'normal',
    data:
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">\n  <svg class="dropIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><style> svg.dropIcon {fill: #3f51b5;} </style>\n  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7"/>\n  <path d="M0 0h24v24H0z" fill="none"/>\n</svg>\n  <svg x="6" y="4" class="pumpIcon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 50 50"><style> svg.pumpIcon {fill: white;} </style>\n  <path d="M 7 7 L 7 11 L 18 11 L 18 7 L 7 7 z M 9 13 L 9 20 L 9 37 L 21 37 L 21 19 L 18 19 L 18 28 L 16 28 L 16 19 L 16 16 L 16 13 L 9 13 z M 43 14 L 28 14.03125 C 26.145 14.03125 24.319 15.87 23 17.625 L 23 38.4375 C 24.319 40.1925 26.145 42.03125 28 42.03125 L 43 42 C 46.309 42 49 39.309 49 36 L 49 20 C 49 16.691 46.309 14 43 14 z M 29 16 L 43 16 L 43 40 L 29 40 L 29 39.03125 L 41 39 L 41 37 L 29 37.03125 L 29 35.03125 L 41 35 L 41 33 L 29 33.03125 L 29 31.03125 L 41 31 L 41 29 L 29 29.03125 L 29 27.03125 L 41 27 L 41 25 L 29 25.03125 L 29 23.03125 L 41 23 L 41 21 L 29 21.03125 L 29 19.03125 L 41 19 L 41 17 L 29 17.03125 L 29 16 z M 1 22 L 1 35 L 5 35 L 5 33 L 7 33 L 7 24 L 5 24 L 5 22 L 1 22 z" />\n</svg>\n\t%s\n\t<path d="M0 0h24v24H0z" fill="none"/>\n</svg>',
    name: 'pump_normal_icon',
    size: '64',
    type: 'Local',
  },
];
module.exports = {
  init: async app => {
    let model = app.models.Icon;
    mapSeries(
      data,
      async item => {
        let record = dataUtil.defaultOperationData({ data: item, app });
        await model.replaceOrCreate(record);
        return true;
      },
      err => (err ? console.error('init wsrc Icon error', err) : console.log('init wsrc Icon OK!')), // eslint-disable-line no-console
    );
  },
};
