var numberOfLevels = 3;
var levels = [];

levels[0] = {};
levels[0].Init = function()
{
	InitIntro();
}

levels[1] = {};
levels[1].Init = function()
{
InitRock(2085, 990, 330, 480);
InitRock(2220, 1530, 600, 600);
InitRock(2640, 2160, 1440, 660);
InitRock(4260, 2850, 4680, 720);
InitModule(5010, 2040);
InitFlagBlock(3555, 2160, 390, 660);
InitFlagBlock(6450, 1860, 300, 1260);
InitRock(6690, 2880, 180, 660);
InitRock(6840, 2925, 120, 570);
InitRock(6990, 3000, 180, 540);
InitRock(7155, 3045, 150, 510);
InitRock(7275, 3090, 90, 480);
InitRock(7380, 3165, 120, 450);
InitRock(7500, 3225, 120, 450);
InitRock(7590, 3285, 60, 450);
InitRock(7680, 3330, 120, 420);
InitRock(7800, 3390, 120, 420);
InitRock(7905, 3465, 90, 450);
InitRock(7995, 3510, 90, 420);
InitRock(8820, 3780, 480, 540);
InitRock(8820, 3375, 360, 270);
InitRock(8820, 3030, 180, 420);
InitRock(8820, 2670, 60, 300);
InitRock(8835, 2340, 30, 360);
InitRock(8700, 4290, 720, 480);
InitRock(8265, 4380, 150, 420);
InitRock(8130, 4485, 120, 390);
InitRock(7935, 4440, 270, 180);
InitRock(8010, 4575, 120, 90);
InitMovingRock(7710, 4410, 7170, 4410);
InitRock(6945, 4545, 150, 330);
InitRock(6750, 4500, 240, 300);
InitRock(6630, 4350, 0, 0);
InitRock(6480, 4410, 300, 240);
InitRock(7065, 4590, 90, 180);
InitRock(8475, 3645, 210, 150);
InitRock(6270, 4485, 120, 270);
InitRock(6180, 4620, 60, 360);
InitRock(5835, 4485, 150, 270);
InitRock(5940, 4620, 60, 360);
InitRock(5685, 4290, 150, 480);
InitRock(5685, 3975, 90, 150);
InitRock(5685, 3810, 30, 180);
InitSoftRock(6060, 4605, 180, 90);
InitRock(6060, 5040, 180, 120);
InitRock(6060, 5040, 300, 60);
InitRock(6495, 5130, 210, 60);
InitRock(6495, 5130, 150, 120);
InitSoftRock(6855, 5325, 150, 90);
InitMovingRock(6660, 5580, 6180, 5760);
InitSoftRock(5595, 6540, 90, 180);
InitRock(5325, 6630, 90, 180);
InitRock(5415, 6780, 90, 120);
InitRock(5325, 6825, 90, 210);
InitRock(5445, 6915, 150, 150);
InitRock(5565, 7020, 90, 180);
InitRock(5895, 6555, 510, 90);
InitRock(5865, 7080, 510, 180);
InitRock(6180, 7020, 120, 180);
InitLandingSpot(5010, 2490, 5010, 1710);
InitRock(7035, 4470, 30, 60);
InitRock(6855, 5595, 150, 150);
InitRock(6855, 5610, 270, 120);
InitAmmonia(2490, 2910, 9240, 6270);
InitRock(8310, 4140, 60, 60);
InitRock(8175, 4260, 30, 60);
InitRock(7065, 4485, 30, 30);
InitRock(6195, 4410, 30, 60);
InitRock(5385, 6675, 30, 90);
InitRock(6045, 5865, 150, 90);
InitRock(6045, 5895, 210, 90);
InitRock(5055, 5625, 90, 270);
InitRock(5055, 6060, 210, 600);
InitRock(5250, 6300, 60, 600);
InitRock(5190, 6210, 60, 660);
InitRock(5715, 6345, 150, 330);
InitSoftRock(5505, 6345, 90, 210);
InitSoftRock(5475, 6675, 150, 90);
InitSoftRock(5505, 6780, 90, 120);
InitRock(5415, 6390, 90, 480);
InitRock(5325, 6300, 90, 480);
InitRock(5745, 6150, 150, 60);
InitRock(5790, 6090, 120, 60);
InitRock(5850, 6030, 120, 60);
InitRock(5895, 5955, 90, 90);
InitDarkness(4560, 6360, 9855.533073967563, 7906.507391112137);
InitMaggotType3(5940, 6960);
InitRock(6462.892010465041, 7068.434186494368, 460.30774557130735, 203.316142036796);
InitRock(6732.895847089911, 7024.51789981442, 180.54473412867537, 183.79779240126481);
InitMaggotType2(6299.4258322674605, 6940.75164929526);
InitMaggotType2(6397.017580445123, 6944.0047075678485);
InitMaggotType2(6505.995032576846, 6944.0047075678485);
InitMaggotType2(6597.08066420933, 6934.245532750082);
InitRock(6775.998869201736, 7227.020777283078, 81.32645681471877, 260.2446618070999);
InitRock(6816.662097609094, 7262.804418281554, 45.54281581624218, 133.37538917613801);
InitRock(6858.138590584602, 7335.184964846654, 63.43463631548093, 125.24274349466668);
InitRock(7401.822757377949, 7385.109999658207, 1085.7418044503847, 134.00718148527903);
InitMaggotType2(6943.235637669808, 7266.60861452595);
InitMaggotType2(7096.4788786099425, 7266.60861452595);
InitMaggotType2(7224.181579393388, 7265.264375570335);
InitMaggotType2(7368.015147644217, 7265.264375570335);
InitMaggotType2(7533.356539184889, 7265.264375570335);
InitMaggotType2(7647.616850412182, 7267.9528534815645);
InitMaggotType1(6947.268354536658, 7011.2032129590625, 7244.345163727614);
InitMaggotType1(7425.817422735674, 7023.301363559599, 7730.959665660324);
InitMaggotType2(7759.188683728247, 7276.018287215258);
InitMaggotType2(7830.433348375852, 7286.77219886018);
InitRock(7971.578438715449, 7267.952853481567, 94.09672689306262, 188.19345378612616);
InitRock(8233.032915582615, 7396.999793220624, 509.46656417815575, 158.6201967625957);
InitMaggotType3(8249.835902527802, 7304.247305283178);
InitMaggotType1(8038.790386496219, 7298.870349460718, 8460.881418559387);
InitRock(8585.895641431602, 7331.80420387329, 198.94736543104773, 90.06401002621715);
InitRock(8642.353677567444, 7288.788557293604, 177.43954214120458, 55.11379718022181);
InitRock(8704.86078900355, 7255.854702881032, 168.02986945189878, 48.39260240214662);
InitRock(8761.318825139391, 7223.592967946264, 143.83356825082592, 48.39260240214662);
InitRock(8823.8259365755, 6840.484865595934, 303.7980039690319, 59.146514047068194);
InitRock(9102.083400387852, 6866.025405752622, 317.2403935251841, 107.53911644921482);
InitRock(8865.497344199575, 7274.001928781835, 104.8506385379842, 106.19487749359905);
InitRock(8952.872876314563, 7317.689694839328, 129.04693973905887, 120.98150600536701);
InitRock(9053.018678507895, 7336.509040217941, 146.5220461620538, 104.8506385379842);
InitRock(9235.163056993755, 7373.475611497359, 293.04409232410944, 116.94878913852153);
InitRock(9407.225643312502, 7228.297804290919, 102.16216062675448, 280.9459417235739);
InitRock(9340.013695531743, 6875.435078441928, 188.19345378612707, 207.01279916473868);
InitRock(9385.045700544852, 7033.383155726712, 130.39117869467373, 157.2759578069763);
InitCube(9244.572729683065, 7230.314162724337);
InitSpace(1900.8198878856979, 620.014185984171, 10137.481715165566, 8075.420826394675);
InitCheckpoint(7831.370399382633, 3024.2445137655777, 82.26347489181353, 693.0074551492121);
InitCheckpoint(7927.344453423082, 4296.835542016192, 114.67029833404285, 351.4893927195644);
InitCheckpoint(6498.951389392521, 4106.133850221535, 124.64162862395915, 508.5378447857529);
InitCheckpoint(6061.459272922427, 4936.247096857098, 117.16313090652147, 89.7419726092512);
InitCheckpoint(6042.763028628833, 5756.389013202743, 114.67029833404285, 134.61295891387545);
InitCheckpoint(5589.067500437624, 6833.292684513743, 54.842316594541444, 224.35493152312756);
InitCheckpoint(6167.404657252791, 6870.685173100928, 59.8279817395005, 204.41227094329315);
InitCheckpoint(6752.128409914827, 6822.456073496192, 45.324228590530765, 296.6676780471089);
InitCheckpoint(7902.345638477335, 6987.373608480372, 49.376507480292275, 303.06959763765735);
InitCheckpoint(8725.571202847057, 7046.114626000035, 81.72663307082985, 335.419723228194);
InitRockNoBug(5595, 6240, 90, 60);
InitRockNoBug(5505, 6480, 90, 60);
InitRockNoBug(5595, 6660, 90, 60);
InitRockNoBug(6150, 6630, 120, 120);
InitRockNoBug(6795, 6645, 210, 150);
InitRockNoBug(6450, 6585, 540, 90);
InitRockNoBug(7050, 6705, 360, 150);
InitRockNoBug(7470, 6750, 540, 120);
InitRockNoBug(7875, 6780, 330, 120);
InitRockNoBug(8131.599431249986, 6864.466141641578, 226.12426524503462, 196.40507609854467);
InitRockNoBug(8375.167568385355, 6775.308574202108, 160.2251936593384, 204.15790804980315);
InitRockNoBug(8576.741199118063, 6738.48262243363, 286.8547821965585, 202.86576939126007);
InitRockNoBug(7092.796234889, 7051.2796565223725, 356.3507912622672, 39.73249240554924);
InitRockNoBug(7570.206963949422, 7061.833599817597, 360.07571242528775, 40.97413279322245);
InitRockNoBug(7897.379206101361, 7152.473348117755, 137.82208303174775, 98.08959062619851);
InitRockNoBug(8282.092069166942, 7019.295049319995, 118.95732803224564, 362.6747805861105);
InitRockNoBug(3891.4275776770023, 6211.877877616715, 2121.8779740816653, 338.7872395592576);
InitRockNoBug(3071.205839796695, 4687.335299600057, 481.43449832105034, 3031.254248688094);
}

levels[2] = {};
levels[2].Init = function()
{
	InitEnding();
}