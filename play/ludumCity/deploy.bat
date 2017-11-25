echo S | del tmp\
rmdir tmp
mkdir tmp
copy *.js tmp\
copy *.png tmp\
copy *.html tmp\
copy *.ogg tmp\
copy *.json tmp\
cd tmp
surge .\ careless-drug.surge.sh
pause