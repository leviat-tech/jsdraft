const hash = require('./hash.js');


function crosshatch(name, scale = 1, angle = 0, color = 'black', bg = 'white', sw = 1, transform) {
  return `
  <pattern id="${name}" patternUnits="userSpaceOnUse" width="10" height="10"
    patternTransform="rotate(${45 + angle}) scale(${scale} ${scale})${transform}">
    <rect fill="${bg}" x="0" y="0" width="10" height="10" />
    <line stroke="${color}" stroke-width="${sw / scale}" vector-effect="non-scaling-stroke" x1="5" y1="0" x2="5" y2="10" />
    <line stroke="${color}" stroke-width="${sw / scale}" vector-effect="non-scaling-stroke" x1="0" y1="5" x2="10" y2="5" />
  </pattern>
  `;
}

function lines(name, scale = 1, angle = 0, color = 'black', bg = 'white', sw = 1, transform) {
  return `
  <pattern id="${name}" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(${45 + angle}) scale(${scale} ${scale})${transform}">
    <rect fill="${bg}" x="0" y="0" width="10" height="10" />
    <line stroke="${color}" stroke-width="${sw / scale}" vector-effect="non-scaling-stroke" x1="0" y1="5" x2="10" y2="5" />
  </pattern>
  `;
}

function steel(name, scale = 1, angle = 0, color = 'black', bg = 'white', sw = 1, transform) {
  return `
  <pattern id="${name}" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(${45 + angle}) scale(${scale} ${scale})${transform}">
    <rect fill="${bg}" x="0" y="0" width="10" height="10" />
    <line stroke="${color}" stroke-width="${sw / scale}" vector-effect="non-scaling-stroke" x1="0" y1="5" x2="10" y2="5" />
    <line stroke="${color}" stroke-width="${sw / scale}" vector-effect="non-scaling-stroke" x1="0" y1="8" x2="10" y2="8" />
  </pattern>
  `;
}

function concrete(name, scale = 1, angle = 0, color = 'black', bg = 'white', sw = 1, transform) {
  const hash_input = `${color}-${sw}-${scale}`;
  const h = hash(hash_input);
  const l = `lines-${h}`;

  return `
  <pattern id="${name}" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(${angle}) scale(${scale * 10} ${scale * 10})${transform}">
    <defs><style>.${l}{fill:none;stroke:${color};vector-effect:non-scaling-stroke;stroke-width:${sw / (scale * 10)}}</style></defs>
    <rect fill="${bg}" x="0" y="0" width="10" height="10" />
    <path d="M0.477692 8.27538L0.625215 8.21918" class="${l}"/>
    <path d="M1.00104 9.81383L1.41551 9.2132L1.73163 9.79275L1.00104 9.81383Z" class="${l}"/>
    <path d="M3.34387 6.86335L3.69161 7.44642L4.07095 6.81769L3.34387 6.86335Z" class="${l}"/>
    <path d="M5.7183 9.91219L5.20197 9.5188L5.73235 9.19565L5.7183 9.91219Z" class="${l}"/>
    <path d="M0.393402 6.03793L0.460139 6.7615L0.987009 6.41025L0.393402 6.03793Z" class="${l}"/>
    <path d="M6.76852 5.92905L6.37512 6.54724L7.09869 6.46997L6.76852 5.92905Z" class="${l}"/>
    <path d="M8.86899 8.42642L8.88304 9.17458L9.45206 8.81982L8.86899 8.42642Z" class="${l}"/>
    <path d="M2.05127 3.88127L2.64488 4.28872L2.6238 3.56866L2.05127 3.88127Z" class="${l}"/>
    <path d="M0.288025 1.21882L0.604147 1.7773L0.972956 1.17667L0.288025 1.21882Z" class="${l}"/>
    <path d="M3.28769 0.927288L3.69514 0.295044L3.99018 0.832452L3.28769 0.927288Z" class="${l}"/>
    <path d="M5.75342 2.76431L5.82367 3.50544L6.37513 3.17176L5.75342 2.76431Z" class="${l}"/>
    <path d="M7.44293 0.628717L8.03303 1.02563L7.98385 0.309082L7.44293 0.628717Z" class="${l}"/>
    <path d="M8.73901 3.58624L9.05162 4.1939L9.43097 3.58624H8.73901Z" class="${l}"/>
    <path d="M0.649811 0.544434L0.670886 0.656833" class="${l}"/>
    <path d="M1.81595 0.600647L1.7738 0.720071" class="${l}"/>
    <path d="M2.54303 0.944878L2.68353 0.916779" class="${l}"/>
    <path d="M2.31824 1.8335L2.46927 1.84052" class="${l}"/>
    <path d="M1.07832 1.95292L0.951874 1.94589" class="${l}"/>
    <path d="M1.90727 2.76431L1.88971 2.92589" class="${l}"/>
    <path d="M0.713043 2.75729L0.758705 2.88374" class="${l}"/>
    <path d="M0.723572 3.53003L0.87812 3.53705" class="${l}"/>
    <path d="M1.67545 3.66702L1.6895 3.84967" class="${l}"/>
    <path d="M2.97156 3.70917H3.12611" class="${l}"/>
    <path d="M3.84263 2.40958L3.82858 2.53954" class="${l}"/>
    <path d="M4.51001 1.23289L4.63295 1.22586" class="${l}"/>
    <path d="M5.42676 1.40149L5.43378 1.54199" class="${l}"/>
    <path d="M4.6189 2.73972L4.74886 2.7327" class="${l}"/>
    <path d="M5.16333 3.13313L5.32842 3.11557" class="${l}"/>
    <path d="M7.05305 0.41095L7.03549 0.583061" class="${l}"/>
    <path d="M8.50718 0.453094L8.39127 0.460119" class="${l}"/>
    <path d="M8.17703 1.21881V1.39092" class="${l}"/>
    <path d="M6.92309 1.46119L6.74747 1.41904" class="${l}"/>
    <path d="M6.74747 2.19178L6.89499 2.10748" class="${l}"/>
    <path d="M6.8212 2.76782L6.9055 2.90481" class="${l}"/>
    <path d="M7.9136 2.14963L7.97683 2.29013" class="${l}"/>
    <path d="M8.08568 2.93994L7.95221 2.95048" class="${l}"/>
    <path d="M9.1254 3.08746L9.14296 2.95047" class="${l}"/>
    <path d="M9.53987 4.31683L9.41693 4.32386" class="${l}"/>
    <path d="M8.41587 4.21848L8.29294 4.23604" class="${l}"/>
    <path d="M7.55883 3.94098L7.45697 4.04635" class="${l}"/>
    <path d="M6.11169 3.98666L6.13628 4.15175" class="${l}"/>
    <path d="M2.87672 4.5065L2.75027 4.62944" class="${l}"/>
    <path d="M1.3804 4.62943L1.52793 4.7067" class="${l}"/>
    <path d="M1.46118 5.4654L1.55251 5.34949" class="${l}"/>
    <path d="M2.62733 5.41974L2.6203 5.5778" class="${l}"/>
    <path d="M1.45416 6.06253L1.54549 6.196" class="${l}"/>
    <path d="M2.69407 6.1152L2.57816 6.23814" class="${l}"/>
    <path d="M3.81805 6.29083H3.64243" class="${l}"/>
    <path d="M4.86478 6.43836V6.2803" class="${l}"/>
    <path d="M4.49243 5.1317L4.50999 4.96661" class="${l}"/>
    <path d="M4.69266 4.12366L4.76642 4.18337" class="${l}"/>
    <path d="M5.96416 4.96661L5.79907 5.00174" class="${l}"/>
    <path d="M7.19354 4.88232L7.36917 4.94204" class="${l}"/>
    <path d="M7.42534 5.56726L7.26025 5.64805" class="${l}"/>
    <path d="M8.17703 5.76047L8.18406 5.91502" class="${l}"/>
    <path d="M9.16052 5.19846L9.33615 5.18793" class="${l}"/>
    <path d="M9.3537 5.94661L9.27994 5.85529" class="${l}"/>
    <path d="M8.58447 7.05655L8.51773 7.20407" class="${l}"/>
    <path d="M7.77663 6.85635L7.64667 6.9266" class="${l}"/>
    <path d="M7.67474 8.3632L7.81876 8.31754" class="${l}"/>
    <path d="M8.28241 8.74606L8.42291 8.76363" class="${l}"/>
    <path d="M9.20618 9.66983L9.20969 9.82438" class="${l}"/>
    <path d="M6.09064 9.33967L6.22762 9.33264" class="${l}"/>
    <path d="M7.83981 9.7998L7.9206 9.89113" class="${l}"/>
    <path d="M4.78751 9.49421L4.81912 9.33966" class="${l}"/>
    <path d="M5.04039 8.52829L4.88232 8.57747" class="${l}"/>
    <path d="M5.41623 7.38672L5.46189 7.50263" class="${l}"/>
    <path d="M5.81315 6.54724L5.58835 6.621" class="${l}"/>
    <path d="M6.85281 8.00491L6.96872 8.17" class="${l}"/>
    <path d="M3.88478 8.3667L3.79697 8.51774" class="${l}"/>
    <path d="M3.87076 9.15701L4.01126 9.16053" class="${l}"/>
    <path d="M4.14472 7.46048L4.02881 7.57639" class="${l}"/>
    <path d="M2.7608 8.98489L2.82403 9.14647" class="${l}"/>
    <path d="M2.97507 7.39377L3.09449 7.47807" class="${l}"/>
    <path d="M1.7984 8.18756L1.98456 8.08218" class="${l}"/>
    <path d="M2.02319 8.7601L1.95645 8.89709" class="${l}"/>
    <path d="M2.09344 7.25327L2.24799 7.28137" class="${l}"/>
    <path d="M0.783284 7.23218L0.723572 7.35863" class="${l}"/>
  </pattern>
  `;
}

module.exports = {
  crosshatch,
  lines,
  steel,
  concrete,
};
