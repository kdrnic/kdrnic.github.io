@echo off
set PATH=C:\Python27\Scripts;%PATH%
for %%f in (*.c) do (
type begin.html | sed s_FILENAME_%%f_g > %%f.html
type %%f >> %%f.html
type end.html >> %%f.html
)
echo ^<html^>^<body style="float: left; white-space: nowrap;"^> > examples.txt.html
type examples.txt | sed -r -e "s_^(ex[0-9]+)(.+)_<a target='right' href='\1.c.html'>\1</a>\2<br>_" >> examples.txt.html
echo ^</body^>^</html^> >> examples.txt.html
