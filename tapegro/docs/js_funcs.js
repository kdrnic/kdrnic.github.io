/******************************************************************************/
/******************************************************************************/
/**
 * Direct keyboard input through Allegro's key. 
 * Only recommended to let the user pick keyboard controls: use "buttons[player]" and "dpad[player]" for game input.
 * @param	{Integer}	scancode
 * @return	{Boolean}	Whether the key is pressed (value of key[scancode])
 */
function Key(scancode){} //src/js_funcs.c:72
/**
 * Direct keyboard input through Allegro's keypressed and readkey. 
 * Contrary to readkey, doesn't wait for a keypress, always returning immediately. 
 * Only recommended to let the user pick keyboard controls: use "buttons[player]" and "dpad[player]" for game input.
 * @return	{Integer}	0 if no key is pressed, scancode otherwise
 */
function ReadKey(){} //src/js_funcs.c:81
/**
 * Direct keyboard input through Allegro's keypressed and readkey. 
 * Contrary to readkey, doesn't wait for a keypress, always returning immediately.
 * @return	{Integer}	-1 if no key is pressed, ASCII code otherwise (affected normally by shift, ctrl, capslock etc)
 */
function ReadKeyASCII(){} //src/js_funcs.c:89
/**
 * Direct joystick input (through Allegro's "joy").
 * Only recommended to let the user pick joystick controls: use "buttons[player]" and "dpad[player]" for game input.
 * @param	{Integer}	id	-	Joystick id, from 0 to a max of 16
 * @return	{Object}	A Javascript object tree equivalent to Allegro's JOYSTICK_INFO
 */
function Joystick(id){} //src/js_funcs.c:98
/**
 * Similar to console.log, a text output function for debugging. 
 * Contrary to usual console.log behaviour, file, line and time are not printed.
 * This is a variadic function taking any number of arguments.
 */
function Cout(){} //src/js_funcs.c:171
/**
 * Will close the program normally, after completing the frame (i.e. after Loop returns). Execution does continue after the call.
 */
function Quit(){} //src/js_funcs.c:199
/**
 * Will restart the game, after completing the frame (i.e. after Loop returns).
 */
function Restart(){} //src/js_funcs.c:209
/**
 * Allegro's arc. 
 * Draws a circular arc with centre x, y and radius r, in an anticlockwise direction starting from the angle a1 and ending when it reaches a2.
 * These values are specified with 256 equal to a full circle, 64 a right angle, etc. Zero is to the right of the centre point, and larger values rotate anticlockwise from there.
 * @param	{Bitmap}	bitmap
 * @param	{Integer}	x
 * @param	{Integer}	y
 * @param	{Fixed}		ang1
 * @param	{Fixed}		ang2
 * @param	{Integer}	r
 */
function Arc(bitmap, x, y, ang1, ang2, r, color){} //src/js_funcs.c:262
/**
 * Allegro's circle.
 * @param	{Bitmap}	bitmap
 * @param	{Integer}	x
 * @param	{Integer}	y
 * @param	{Integer}	radius
 * @param	{Integer}	color
 */
function Circle(bitmap, x, y, radius, color){} //src/js_funcs.c:273
/**
 * Allegro's circlefill. Like {@link Circle}, but with the insides filled in.
 * @param	{Bitmap}	bitmap
 * @param	{Integer}	x
 * @param	{Integer}	y
 * @param	{Integer}	radius
 * @param	{Integer}	color
 */
function CircleFill(bitmap, x, y, radius, color){} //src/js_funcs.c:284
/**
 * Allegro's clear_to_color. Fills the passed bitmap with the specified colour.
 * @param	{Bitmap}	bitmap
 * @param	{Integer}	colour
 */
function ClearToColor(bitmap, colour){} //src/js_funcs.c:292
/**
 * Allegro's ellipse.
 * @param	{Bitmap}	bitmap
 * @param	{Integer}	x
 * @param	{Integer}	y
 * @param	{Integer}	radiusX
 * @param	{Integer}	radiusY
 * @param	{Integer}	color
 */
function Ellipse(bitmap, x, y, radiusX, radiusY, color){} //src/js_funcs.c:304
/**
 * Allegro's circlefill. Like {@link Ellipse}, but with the insides filled in.
 * @param	{Bitmap}	bitmap
 * @param	{Integer}	x
 * @param	{Integer}	y
 * @param	{Integer}	radiusX
 * @param	{Integer}	radiusY
 * @param	{Integer}	color
 */
function EllipseFill(bitmap, x, y, radiusX, radiusY, color){} //src/js_funcs.c:316
/**
 * Allegro's floodfill.
 * @param	{Bitmap}	bitmap
 * @param	{Integer}	x
 * @param	{Integer}	y
 * @param	{Integer}	colour
 */
function FloodFill(bitmap, x, y, colour){} //src/js_funcs.c:326
/**
 * Allegro's hline.
 * @param	{Bitmap}	bitmap
 * @param	{Integer}	x1
 * @param	{Integer}	y
 * @param	{Integer}	x2
 * @param	{Integer}	colour
 */
function HLine(bitmap, x1, y, x2, colour){} //src/js_funcs.c:337
/**
 * Allegro's line.
 * @param	{Bitmap}	bitmap
 * @param	{Integer}	x1
 * @param	{Integer}	y1
 * @param	{Integer}	x2
 * @param	{Integer}	y2
 * @param	{Integer}	colour
 */
function Line(bitmap, x1, y1, x2, y2, colour){} //src/js_funcs.c:349
/**
 * Allegro's putpixel.
 * @param	{Bitmap}	bitmap
 * @param	{Integer}	x
 * @param	{Integer}	y
 * @param	{Integer}	colour
 */
function PutPixel(bitmap, x, y, colour){} //src/js_funcs.c:359
/**
 * Allegro's rect.
 * @param	{Bitmap}	bitmap
 * @param	{Integer}	x1
 * @param	{Integer}	y1
 * @param	{Integer}	x2
 * @param	{Integer}	y2
 * @param	{Integer}	colour
 */
function Rect(bitmap, x1, y1, x2, y2, colour){} //src/js_funcs.c:371
/**
 * Allegro's rectfill. Like {@link Rect}, but with the insides filled in.
 * @param	{Bitmap}	bitmap
 * @param	{Integer}	x1
 * @param	{Integer}	y1
 * @param	{Integer}	x2
 * @param	{Integer}	y2
 * @param	{Integer}	colour
 */
function RectFill(bitmap, x1, y1, x2, y2, colour){} //src/js_funcs.c:383
/**
 * Allegro's triangle. Draws a filled triangle (unlike what you'd expect from other primitives, there is no TriangleFill).
 * @param	{Bitmap}	bitmap
 * @param	{Integer}	x1
 * @param	{Integer}	y1
 * @param	{Integer}	x2
 * @param	{Integer}	y2
 * @param	{Integer}	x3
 * @param	{Integer}	y3
 * @param	{Integer}	colour
 */
function Triangle(bitmap, x1, y1, x2, y2, x3, y3, colour){} //src/js_funcs.c:397
/**
 * Allegro's vline.
 * @param	{Bitmap}	bitmap
 * @param	{Integer}	x
 * @param	{Integer}	y1
 * @param	{Integer}	y2
 * @param	{Integer}	colour
 */
function VLine(bitmap, x, y1, y2, colour){} //src/js_funcs.c:408
/**
 * Allegro's getpixel.
 * @param	{Bitmap}	bitmap
 * @param	{Integer}	x
 * @param	{Integer}	y
 * @return	{Integer}	Colour value
 */
function GetPixel(bitmap, x, y){} //src/js_funcs.c:418
/**
 * Puts a batch of pixels at once into the passed bitmap.
 * There is an option to use RLE, in which case, runs of colours will be written filling horizontal lines, with a single starting position for each run of colour values. Otherwise, there is a position and colour triplet for each pixel.
 * @param	{Bitmap}		bitmap
 * @param	{Boolean}		rle	-	Whether RLE is used
 * @param	{Int32Array}	buf	-	A typed array, elements are in a [x, y, n, c1, c2, c3, ... , cn, x, y, n, c1, c2, ...] format if RLE is used or [x1, y1, c1, x2, y2, c2, x3, y3, c3, ...] if not
 */
function PutPixelBatch(bitmap, rle, buf){} //src/js_funcs.c:444
/**
 * Creates a bitmap object through Allegro's create_bitmap.
 * @param	{Integer}	width
 * @param	{Integer}	height
 * @return	{Bitmap}
 */
function CreateBitmap(w,h){} //src/js_funcs.c:501
/**
 * Creates a bitmap object through Allegro's create_bitmap_ex.
 * Difference from @CreateBitmap is that it specifies color depth.
 * Has use to create temporary transfer areas between color depths, making use of Allegro's color conversion stuff - for example, transfer a 8bit image into a 32bit bitmap, apply truecolor effects to it and then move it back to the 8bit one.
 * @param	{Integer}	coldepth
 * @param	{Integer}	width
 * @param	{Integer}	height
 * @return	{Bitmap}
 */
function CreateBitmapEx(coldepth,w,h){} //src/js_funcs.c:522
/**
 * Creates a subbitmap through Allegro's create_sub_bitmap.
 * Those share memory, etc. and drawing to a subbitmap will affect the corresponding area in the source bitmap.
 * Useful for example to separate the screen in areas dynamically without keeping displacements in every draw call.
 * The returned bitmap will have the "parent" property set to the source bitmap.
 * @param	{Bitmap}	bmp
 * @param	{Integer}	x	-	X coordinate of subbitmap, currently can be any value, however eventually care may need to be taken that multiple of 4 aligned values be used when taking subbitmaps of screen 
 * @param	{Integer}	y	-	As above, including alignment issue
 * @param	{Integer}	w
 * @param	{Integer}	h
 * @return	{Bitmap}
 */
function CreateSubBitmap(bmp, x, y, w, h){} //src/js_funcs.c:547
/**
 * Loads a bitmap through Allegro's load_bitmap. 
 * The palette generated by Allegro together with loading the bitmap is discarded.
 * Returns null on failures such as file not found.
 * @param	{String}	filename
 * @return	{Bitmap}
 */
function LoadBitmap(filename){} //src/js_funcs.c:597
/**
 * Saves a bitmap through Allegro's save_bitmap.
 * If the program is running on 8bit colour depth, the palette used is the currently set global palette.
 * @param	{String}	filename
 * @param	{Bitmap}	bitmap
 */
function SaveBitmap(filename, bitmap){} //src/js_funcs.c:614
/**
 * Allegro's draw_sprite. Draws the whole bitmap at the specified position.
 * Note that DrawSprite et al. is of different use.
 * @param	{Bitmap}	bmp	-	Bitmap drawed on
 * @param	{Bitmap}	spr	-	Bitmap drawed
 * @param	{Integer}	X
 * @param	{Integer}	Y
 */
function DrawBitmap(bmp, spr, x, y){} //src/js_funcs.c:625
/**
 * Allegro's rotate_scaled_sprite et al. Draws the whole bitmap at the specified position.
 * Rotation, scaling and flipping are optional transforms.
 * Note that DrawTransformSprite is of different use.
 * @param	{Bitmap}	bitmap		-	Bitmap drawed on
 * @param	{Bitmap}	spr			-	Bitmap drawed
 * @param	{Integer}	transforms	-	Binary flags for transforms used (SPRITE_FLIP, SPRITE_ROTATE, SPRITE_SCALE)
 * @param	{Fixed=}	angle		-	256.0 is a full rotation
 * @param	{Fixed=}	scale		-	2.0 is double the size
 * @param	{Integer=}	flip		-	Binary flags (FLIP_V, FLIP_H)
 */
function DrawTransformBitmap(bmp, spr, transforms, x, y, angle, scale, flip){} //src/js_funcs.c:649
/**
 * Allegro's draw_trans_sprite/draw_lit_sprite. Draws the whole bitmap at the specified position, with specified blending function.
 * Note that DrawSprite et al. is of different use.
 * @param	{Bitmap}	bmp		-	Bitmap drawed on
 * @param	{Bitmap}	spr		-	Bitmap drawed
 * @param	{Integer}	X
 * @param	{Integer}	Y
 * @param	{Integer}	blender	-	If negative, transparency blending is used, otherwise this is the light level for light blending or color for colortable blending (0 to 255)
 */
function DrawBlendedBitmap(bmp, spr, x, y, blender){} //src/js_funcs.c:689
/**
 * Allegro's PALETTE. Just a plain DukTape buffer. Note that while we'd expect 256 3 byte groups for RGB, each entry has a 4th padding byte, so this is actually 1024 bytes long.
 * @typedef		{Buffer}	Palette
 */
/**
 * Loads a palette from an image file using Allegro's load_bitmap.
 * Returns null on failures such as file not found.
 * @param	{String}	filename
 * @return	{Palette}
 */
function LoadPalette(filename){} //src/js_funcs.c:722
/**
 * Returns the palette from the last bitmap loaded.
 * @return	{Palette}
 */
function LastBitmapPalette(){} //src/js_funcs.c:748
/**
 * Sets the current screen palette using Allegro's set_palette. For 8-bit colour modes only.
 * @param	{Palette}	pal
 */
function SetPalette(pal){} //src/js_funcs.c:761
/**
 * Allegro's makecol.
 * > Converts colors from a hardware independent format (red, green, and blue values ranging 0-255) to the pixel format required by the current video mode, calling the preceding 8, 15, 16, 24, or 32 bit makecol functions as appropriate. 
 * @param	{Integer}	r
 * @param	{Integer}	g
 * @param	{Integer}	b
 */
function MakeCol(r,g,b){} //src/js_funcs.c:785
/**
 * Reads a binary file and returns its contents. 
 * Returns null on any failures.
 * @param	{String}	filename
 * @return	{Buffer}	Plain DukTape buffer containing the file's contents.
 */
function ReadFile(filename){} //src/js_funcs.c:807
/**
 * Reads a text file and returns its contents.
 * Returns null on any failures.
 * @param	{String}	filename
 * @return	{String}	String containing the file's contents.
 */
function ReadTextFile(filename){} //src/js_funcs.c:831
/**
 * Writes to a binary file. Previous file contents are discarded.
 * @param	{String}	filename
 * @param	{Buffer}	buf			-	Plain DukTape buffer with contents to be written.
 */
function WriteFile(filename,buf){} //src/js_funcs.c:853
/**
 * Writes to a text file. Previous file contents are discarded.
 * @param	{String}	filename
 * @param	{String}	str			-	Content to be written.
 */
function WriteTextFile(filename,str){} //src/js_funcs.c:878
/**
 * Returns the time a file was last modified. Behaviour is not well known if the file doesn't exist.
 * @param	{String}	filename
 * @return	{Integer}	Likely to be a POSIX time
 */
function FileTime(filename){} //src/js_funcs.c:903
/**
 * Checks for existence of a file. Ignores directories, system files, hidden files, ....
 * @param	{String}	filename
 * @return	{Boolean}
 */
function FileExists(filename){} //src/js_funcs.c:916
/**
 * Lists all files matching the specified wildcard. Useful for example to load all map files within a subdirectory. Will retrieve a max of 1024 files.
 * @param	{String}	wildcard
 * @return	{Array}		Array of filename strings
 */
function ListFiles(wildcard){} //src/js_funcs.c:944
/**
 * Reloads sections of the main config file, to update parameters such as controller configuration.
 * Supports a maximum of 64 sections.
 * @param	{Array}	Array of strings, each a config file section such as "controls"
 */
/**
 * Get configuration values using Allegro's get_config_float, get_config_int and get_config_string.
 * @param	{Object}	configs			-	Will be modified to contain the values read. Example:
 * @param	{Number}	[configs.a_value=5]	-	Reads a floating point value from the root of the config file, with default value 5.0
 * @param	{Object}	configs.a_section	-	A [section] in the config file
 * @param	{String}	[configs.a_section.another_value="Test"]	-	Reads a string value from a section called "a_section", with default value "Test"
 */
function GetConfig(configs){} //src/js_funcs.c:1082
/**
 * Set configuration values using Allegro's set_config_float, set_config_int and set_config_string. Same deal as {@link GetConfig}.
 * Won't actually write to the configuration file until Tapegro closes.
 * @param	{Object}	configs			-	Will be written to config file. Example:
 * @param	{Number}	[configs.a_value=5]	-	Writes "a_value = 5.0" (in the root of the config file i.e. the top with no section above)
 * @param	{Object}	configs.a_section	-	Writes [a_section] in the config file
 * @param	{String}	[configs.a_section.anoter_value="Test"]	-	Writes "another_value = 'Test'"
 */
function SetConfig(configs){} //src/js_funcs.c:1098
/**
 * Allegro's textout. 
 * Unlike the actual textout, the font used is implicit through {@link SetFont}. Use {@link SetTextBgColor} to select the background color used with this function.
 * @param	{Bitmap}	bmp		-	Bitmap written on
 * @param	{String}	text	-	Text
 * @param	{Integer}	x		-	X
 * @param	{Integer}	y		-	Y
 * @param	{Integer}	fg		-	Text colour, or if -1 and a colour font is in use, text is drawn with colours from the original font image for multicoloured text
 */
function TextOut(bmp, text, x, y, fg){} //src/js_funcs.c:1125
/**
 * Selects between left-alligned, right-alligned and centred text (Allegro's textout, textout_right and textout_centre).
 * @param	{Integer}	allign	-	TEXT_LEFT, TEXT_RIGHT or TEXT_CENTER
 */
function SetTextAllign(allign){} //src/js_funcs.c:1144
/**
 * Sets the background color for text written with {@link TextOut}. Default is 0.
 * @param	{Integer}	bg		-	Background colour, or -1 for transparent
 */
function SetTextBgColor(bg){} //src/js_funcs.c:1151
/**
 * Reads a text file and returns its contents.
 * Returns null on any failures.
 * @param	{String}	filename
 * @return	{Font}
 */
function LoadFont(filename){} //src/js_funcs.c:1160
/**
 * Sets the font used by TextOut. 
 * The font is also written to the "currentFont" variable. Overwriting this global directly can cause memory issues with impredictable results including crashes and corruption, plus it will be ignored by {@link TextOut}.
 * @param	{Font}	font
 */
function SetFont(font){} //src/js_funcs.c:1168
/**
 * Allegro's blit. Blit essentially copies an area of an image into another, including transparent colour values (0 for 8-bit depths, 0xFF00FF magic pink, etc.).
 * Additionally, blit performs colour depth conversion between bitmaps.
 * @param	{Bitmap}	src		-	Source bitmap
 * @param	{Bitmap}	dest	-	Destination bitmap
 * @param	{Integer}	sx		-	Source X
 * @param	{Integer}	sy		-	Source Y
 * @param	{Integer}	dx		-	Destination X
 * @param	{Integer}	dy		-	Destination Y
 * @param	{Integer}	w		-	Width of area copied
 * @param	{Integer}	h		-	Height of area copied
 */
function Blit(src, dest, sx, sy, dx, dy, w, h){} //src/js_funcs.c:1232
/**
 * Allegro's stretch_blit. Like {@link Blit} but also stretches the source area into the destination area.
 * @param	{Bitmap}	src		-	Source bitmap
 * @param	{Bitmap}	dest	-	Destination bitmap
 * @param	{Integer}	sx		-	Source X
 * @param	{Integer}	sy		-	Source Y
 * @param	{Integer}	sw		-	Source width
 * @param	{Integer}	sh		-	Source height
 * @param	{Integer}	dx		-	Destination X
 * @param	{Integer}	dy		-	Destination Y
 * @param	{Integer}	dw		-	Destination width
 * @param	{Integer}	dh		-	Destination height
 */
function StretchBlit(src, dest, sx, sy, sw, sh, dx, dy, dw, dh){} //src/js_funcs.c:1251
/**
 * Allegro's masked_blit. Like {@link Blit} but ignores transparent pixels.
 * @param	{Bitmap}	src		-	Source bitmap
 * @param	{Bitmap}	dest	-	Destination bitmap
 * @param	{Integer}	sx		-	Source X
 * @param	{Integer}	sy		-	Source Y
 * @param	{Integer}	dx		-	Destination X
 * @param	{Integer}	dy		-	Destination Y
 * @param	{Integer}	w		-	Width of area copied
 * @param	{Integer}	h		-	Height of area copied
 */
function MaskedBlit(src, dest, sx, sy, dx, dy, w, h){} //src/js_funcs.c:1268
/**
 * Allegro's masked_stretch_blit.
 * @param	{Bitmap}	src		-	Source bitmap
 * @param	{Bitmap}	dest	-	Destination bitmap
 * @param	{Integer}	sx		-	Source X
 * @param	{Integer}	sy		-	Source Y
 * @param	{Integer}	sw		-	Source width
 * @param	{Integer}	sh		-	Source height
 * @param	{Integer}	dx		-	Destination X
 * @param	{Integer}	dy		-	Destination Y
 * @param	{Integer}	dw		-	Destination width
 * @param	{Integer}	dh		-	Destination height
 */
function MaskedStretchBlit(src, dest, sx, sy, sw, sh, dx, dy, dw, dh){} //src/js_funcs.c:1287
/**
 * A sprite sheet structured type.
 * @typedef		{Object}	SpriteSheet
 * @property	{Integer}	numberOfFrames
 * @property	{Integer}	width	-	Of one frame, not of the bitmap
 * @property	{Integer}	height	-	Of one frame, not of the bitmap
 * @property	{Bitmap}	bitmap	-	Bitmap containing the sprite's frames
 * @property	{Pointer}	ptr		-	Internal, so don't mess with it
 */
/**
 * Creates a sprite sheet object, which is used by other sprite functions.
 * All frames will have equal width and height as passed. Frame 0 will be at the top left corner, frame indices grow from left to right and then from top to bottom.
 * @param	{Bitmap}		bitmap	-	Bitmap containing the sprite's frames
 * @param	{Integer}		w		-	Width of one frame
 * @param	{Integer}		h		-	Height of one frame
 * @return	{Spritesheet}	Created sprite sheet
 */
function CreateSpriteSheet(bitmap, w, h){} //src/js_funcs.c:1322
/**
 * Draws a frame from a sprite sheet into the bitmap at the specified position.
 * @param	{Bitmap}		bitmap	-	Bitmap drawed on
 * @param	{SpriteSheet}	ss		-	Spritesheet object
 * @param	{Integer}		x		-	X
 * @param	{Integer}		y		-	Y
 * @param	{Integer}		f		-	Frame index
 */
function DrawSprite(bitmap, ss, x, y, f){} //src/js_funcs.c:1374
/**
 * An extension of {@link DrawSprite}.  Does blending just like {@link DrawBlendedBitmap}.
 * @param	{Bitmap}		bitmap	-	Bitmap drawed on
 * @param	{SpriteSheet}	ss		-	Spritesheet object
 * @param	{Integer}		x		-	X
 * @param	{Integer}		y		-	Y
 * @param	{Integer}		f		-	Frame index
 * @param	{Integer}		blender	-	If negative, transparency blending is used, otherwise this is the light level for light blending or color for colortable blending (0 to 255)
 */
function DrawBlendedSprite(bitmap, ss, x, y, f, blender){} //src/js_funcs.c:1406
/**
 * An extension of {@link DrawSprite}.
 * Uses Allegro's rotate_scaled_sprite et al. Rotation, scaling and flipping are optional transforms.
 * @param	{Bitmap}		bitmap		-	Bitmap drawed on
 * @param	{SpriteSheet}	ss			-	Spritesheet object
 * @param	{Integer}		transforms	-	Binary flags for transforms used (SPRITE_FLIP, SPRITE_ROTATE, SPRITE_SCALE)
 * @param	{Integer}		X
 * @param	{Integer}		Y
 * @param	{Integer}		f			-	Frame index
 * @param	{Fixed=}		angle		-	256.0 is a full rotation
 * @param	{Fixed=}		scale		-	2.0 is double the size
 * @param	{Integer=}		flips		-	Binary flags (FLIP_V, FLIP_H)
 */
function DrawTransformSprite(bitmap, ss, transforms, x, y, f, angle, scale, flips){} //src/js_funcs.c:1444
/**
 * A batch version of {@link DrawSprite}. Allows larger numbers of sprites without performance hits.
 * There is no DrawTransformSpriteBatch nor DrawBlendedSpriteBatch as this function does both.
 * Unlike {@link DrawTransformBitmap}, which can't blend its bitmaps, this function can also do batches of blended sprites.
 * Blending and transforms cannot be used simultaneously.
 * @See DrawTransformSprite
 * @See DrawBlendedSprite
 * @param	{Bitmap}		bitmap		-	Bitmap drawed on
 * @param	{SpriteSheet}	ss			-	Spritesheet object
 * @param	{Integer}		mode		-	Either SPRITE_BLEND or binary flags for transforms used (SPRITE_FLIP, SPRITE_ROTATE, SPRITE_SCALE)
 * @param	{Int32Array}	buf			-	Buffer with several sprites, like the following (values with * may be omitted according to mode flags): [X, Y, frame index, blender*, angle*, scale*, flip*, ...]
 */
function DrawSpriteBatch(bitmap, ss, transforms, buf){} //src/js_funcs.c:1489
/**
 * Allegro's fixed.
 * Allegro uses fixed point arithmetics for certain operations, including drawing rotated or scaled images.
 * > Fixed point numbers can be assigned, compared, added, subtracted, negated and shifted (for multiplying or dividing by powers of two) using the normal integer operators, but you should take care to use the appropriate conversion routines when mixing fixed point with integer or floating point values.
 * @see IntToFix
 * @see FloatToFix
 * @see FixToInt
 * @see FixToFloat
 * @typedef		{Integer}	Fixed
 */
/**
 * Allegro's itofix.
 * @param	{Integer}	v	-	Number to be converted (between 32767 and -32767)
 * @return	{Fixed}
 */
function IntToFix(v){} //src/js_funcs.c:1578
/**
 * Allegro's ftofix.
 * @param	{Number}	v	-	Number to be converted (between 32767 and -32767)
 * @return	{Fixed}
 */
function FloatToFix(v){} //src/js_funcs.c:1587
/**
 * Allegro's fixtoi.
 * @param	{Fixed}	v
 * @return	{Integer}	Regular number
 */
function FixToInt(v){} //src/js_funcs.c:1596
/**
 * Allegro's fixtof.
 * @param	{Fixed}	v
 * @return	{Number}	Regular number
 */
function FixToFloat(v){} //src/js_funcs.c:1605
/**
 * Allegro's load_sample. Loads a digital sample from a sound file.
 * Returns null on any failure.
 * @param	{String}	filename
 * @return	{Sample}	Digital sample object, contains bits, freq, len, and stereo integer valued properties
 */
function LoadSample(filename){} //src/js_funcs.c:1624
/**
 * Allegro's save_sample. Saves a digital sample to a sound file.
 * @param	{String}	filename
 * @param	{Sample}	sample	-	Sample
 */
function SaveSample(filename, sample){} //src/js_funcs.c:1645
/**
 * Allegro's create_sample. Creates a silent digital sample with specified parameters, useful for procedural sfx.
 * Returns null on any failure.
 * @param	{Integer}	bits	-	8 or 16
 * @param	{Integer}	stereo	-	0 for mono, non-zero for stereo
 * @param	{Integer}	freq	-	Frequency in hertz
 * @param	{Integer}	len		-	Number of samples
 * @return	{Sample}	A silent sample
 */
function CreateSample(bits, stereo, freq, len){} //src/js_funcs.c:1657
/**
 * Allegro's play_sample. To play audio samples. 
 * A word of warning: if the given sample goes out of scope while it is playing, the finalizer will stop it before destroying it. So keep all playing samples somewhere.
 * @param	{Sample}	sample	-	Sample
 * @param	{Integer}	vol		-	Volume, 0 to 255
 * @param	{Integer}	pan		-	Pan, 0 left to 255 right
 * @param	{Integer}	freq	-	Relative frequency, where 1000 is the recorded frequency, and 2000 plays at double speed
 * @param	{Boolean}	loop	-	If non-zero, will repeat the sample until StopSample is called
 * @return	{Integer}	Returns the voice number that was allocated for the sample or negative if no voices were available.
 */
function PlaySample(sample, vol, pan, freq, loop){} //src/js_funcs.c:1686
/**
 * Allegro's stop_sample.
 * "Stop a sample from playing, which is required if you have set a sample going in looped mode. If there are several copies of the sample playing, it will stop them all."
 * @param	{Sample}	sample
 */
function StopSample(sample){} //src/js_funcs.c:1709
/**
 * Allegro's adjust_sample.
 * Alter a playing sample's parameters. Useful for e.g. engine sounds.
 * @param	{Sample}	sample	-	Sample
 * @param	{Integer}	vol		-	Volume, 0 to 255
 * @param	{Integer}	pan		-	Pan, 0 left to 255 right
 * @param	{Integer}	freq	-	Relative frequency, where 1000 is the recorded frequency, and 2000 plays at double speed
 * @param	{Boolean}	loop	-	If non-zero, will repeat the sample until StopSample is called
 */
function AdjustSample(sample){sample, vol, pan, freq, loop} //src/js_funcs.c:1730
/**
 * Used to get the raw audio data.
 * Modifying the returned buffer will have no value unless you call SetSampleData, as it is a copy rather than a pointer of the internal buffer.
 * @param	{Sample}		sample	-	Sample to get the raw data from
 * @return	{Uint16Array}	Array of samples in unsigned 16-bit format
 */
function GetSampleData(sample){} //src/js_funcs.c:1752
/**
 * Used to put raw audio data into an usable sample, for procedural audio or otherwise.
 * Copies the passed samples into the internal buffer.
 * @param	{Sample}		sample	-	Sample whose data to be set
 * @param	{Uint16Array}	buf		-	Array of samples in unsigned 16-bit format
 */
function SetSampleData(sample, buf){} //src/js_funcs.c:1776
/**
 * Provides access to sample priority and looping points.
 * @param	{Sample}	sample	-	Sample whose params to be set
 * @param	{Object}	params
 * @param	{Integer=}	params.priority		-	"The priority is a value from 0 to 255 (by default set to 128) and controls how hardware voices on the sound card are allocated if you attempt to play more than the driver can handle. This may be used to ensure that the less important sounds are cut off while the important ones are preserved."
 * @param	{Integer=}	params.loop_start	-	"The variables loop_start and loop_end specify the loop position in sample units, and are set by default to the start and end of the sample."
 * @param	{Integer=}	params.loop_end		-	
 */
function SetSampleParams(sample, params){} //src/js_funcs.c:1802
/**
 * Provides access to sample priority and looping points.
 * @See SetSampleData
 * @param	{Sample}	sample	-	Sample to get params from
 * @return	{Object}	Object as described in {@link SetSampleData}
 */
function GetSampleParams(sample){} //src/js_funcs.c:1826
/**
 * Allegro's load_midi. Loads .mid files.
 * @param	{String}	filename
 * @return	{MIDI}		Object as described in {@link SetSampleData}
 */
function LoadMIDI(filename){} //src/js_funcs.c:1855
/**
 * Allegro's get_midi_length. Will also stop any currently playing MIDI. {@link GetMIDIPos|midi_pos} and {@link GetMIDITime|midi_time} will also be set.
 * @param	{MIDI}		midi
 * @return	{Integer}	Length of the song in seconds.
 */
function GetMIDILength(midi){} //src/js_funcs.c:1863
/**
 * Allegro's pause_midi. Pauses the MIDI player. See {@link ResumeMIDI}.
 */
function PauseMIDI(){} //src/js_funcs.c:1875
/**
 * Allegro's resume_midi. Pauses the MIDI player. See {@link PauseMIDI}.
 */
function ResumeMIDI(){} //src/js_funcs.c:1881
/**
 * Allegro's stop_midi. Stop the MIDI player.
 */
function StopMIDI(){} //src/js_funcs.c:1887
/**
 * Allegro's midi_seek. Seeks to the given position in the playing song.
 * @param	{Integer}	pos	-	Position in beats (not seconds!)
 */
function SeekMIDI(pos){} //src/js_funcs.c:1894
/**
 * Allegro's play_midi. Starts playing a song. 
 * The given MIDI is copied into the currentMIDI global variable, to avoid finalization.
 * @param	{MIDI}		midi
 * @param	{Boolean}	loop	-	If set, continuously loop the song.
 */
function PlayMIDI(midi, loop){} //src/js_funcs.c:1907
/**
 * Allegro's play_looped_midi. Starts playing a song and loops at the specified points.
 * The given MIDI is copied into the currentMIDI global variable, to avoid finalization.
 * @param	{MIDI}		midi
 * @param	{Integer}	loop_start	-	Position in beats (not seconds!)
 * @param	{Integer}	loop_end	-	Position in beats (not seconds!)
 */
function PlayLoopedMIDI(midi, loop_start, loop_end){} //src/js_funcs.c:1928
/**
 * Sets the looping points, the same as {@link PlayLoopedMIDI}
 * @param	{Integer}	loop_start	-	Position in beats (not seconds!)
 * @param	{Integer}	loop_end	-	Position in beats (not seconds!)
 */
function SetMIDILoop(loop_start, loop_end){} //src/js_funcs.c:1948
/**
 * Allegro's midi_pos. Current position in beats of the song being played.
 * @return	{Integer}	Position of the song in seconds.
 */
function GetMIDIPos(){} //src/js_funcs.c:1962
/**
 * Allegro's midi_time. Current position in seconds of the song being played.
 * @return	{Integer}	Position of the song in seconds.
 */
function GetMIDITime(){} //src/js_funcs.c:1969
/**
 * Allegro's midi_out. Direct output of MIDI commands, check some MIDI specs to use. 
 * The first call may need to load MIDI patches, taking some time.
 * @param	{Uint8Array}	data	-	Series of MIDI commands
 */
function MIDIOut(data){} //src/js_funcs.c:1977
/**
 * A tile map drawing routine. Tiles not in the tileset (tile < first or tile > tileset.numberOfFrames) are ignored.
 * @param	{Bitmap}		bmp
 * @param	{Object}		map
 * @param	{Uint16Array}	map.data	-	Tile IDs stored sequentially from left to right and then top to bottom
 * @param	{Integer}		map.width	-	Number of map columns
 * @param	{Integer}		map.height	-	Number of map rows
 * @param	{SpriteSheet}	tileset		-	Each frame will be mapped into one tile
 * @param	{Integer}		first		-	First tile ID in the tileset
 * @param	{Integer}		col			-	First column in the map view
 * @param	{Integer}		row			-	First row in the map view
 * @param	{Integer}		numCols		-	Number of columns in the map view
 * @param	{Integer}		numRows		-	Number of rows in the map view
 * @param	{Integer}		x			-	Coordinate in bmp
 * @param	{Integer}		y			-	Coordinate in bmp
 */
function DrawTileLayer(bmp, map, tileset, first, col, row, numCols, numRows, x, y){} //src/js_funcs.c:2014
/**
 * Allegro's drawing_mode. Sets the drawing mode affecting only the geometric primitive drawing routines like putpixel, lines, rectangles, circles, floodfill, etc, not the text output, blitting, sprite, etc. drawing functions.
 * @param	{Integer}	mode	-	0 for solid (default mode), 1 for blended (transparency, lighting and other effects)
 */
function SetPrimitiveDrawingMode(mode){} //src/js_funcs.c:2094
/**
 * Sets the color map used by transparency and lighting effects in 8-bit color mode. Allegro's color_map.
 * Get a color map from {@link CreateTransTable}, {@link CreateLightTable} or {@link CreateColorTable}.
 * @param	{ColorMap}	cm
 */
function SetColorMap(cm){} //src/js_funcs.c:2108
/**
 * Allegro's create_light_table. Creates a color map for lighting effects in 8-bit color mode.
 * > When combining the colors c1 and c2 with this table, c1 is treated as a light level from 0-255. At light level 255 the table will output color c2 unchanged, at light level 0 it will output the r, g, b value you specify to this function, and at intermediate light levels it will output a color somewhere between the two extremes. The r, g, and b values are in the range 0-63.
 * @param	{Palette}	pal
 * @param	{Integer}	r
 * @param	{Integer}	g
 * @param	{Integer}	b
 * @return	{ColorMap}
 */
function CreateLightTable(pal, r, g, b){} //src/js_funcs.c:2149
/**
 * Allegro's create_trans_table. Creates a color map for transparency effects in 8-bit color mode.
 * > When combining the colors c1 and c2 with this table, the result will be a color somewhere between the two. The r, g, and b parameters specify the solidity of each color component, ranging from 0 (totally transparent) to 255 (totally solid). For 50% solidity, pass 128. This function treats source color #0 as a special case, leaving the destination unchanged whenever a zero source pixel is encountered, so that masked sprites will draw correctly.
 * @param	{Palette}	pal
 * @param	{Integer}	r
 * @param	{Integer}	g
 * @param	{Integer}	b
 * @return	{ColorMap}
 */
function CreateTransTable(pal, r, g, b){} //src/js_funcs.c:2163
/**
 * Allegro's create_color_table. Creates a color map for customised effects in 8-bit color mode.
 * Will stop on the first error encountered.
 * @param	{Palette}	pal
 * @param	{Function}	blendFunc	-	A (palette, color_index1, color_index2)->resulting_rgb_color function
 * @return	{ColorMap}
 */
function CreateColorTable(blendFunc){} //src/js_funcs.c:2204
/**
 * Allegro's set_trans_blender. Selects the default true color blending routine, used for effects in non-8-bit color modes.
 * > When a translucent drawing function is called, the alpha parameter set by this routine is used to select one of the blenders from the table, and that function is then called to blend each pixel with the existing destination color (ie. the alpha parameter controls the solidity of the drawing, from 0 to 255). When a lit sprite drawing function is called, the alpha value passed to this routine is ignored, and instead the color passed to the sprite function is used to select an alpha level. The blender routine will then be used to interpolate between the sprite color and the RGB value that was passed to this function (ranging 0-255).
 * @param	{Integer}	r
 * @param	{Integer}	g
 * @param	{Integer}	b
 * @param	{Integer}	a	-	Alpha
 */
function SetTruecolorBlender(r, g, b, a){} //src/js_funcs.c:2218
/**
 * Loads a dynamically-loaded library. 
 * Those files have .dll extension on Windows, .so on Linux and .dxe on MS-DOS.
 * If the DLL has a function "void TapegroInit(void **funcptrs, char *funcnames, void *duk_ctx)" it will be automatically called, dukfuncnames is comma separated.
 * @param	{String}	filename	-	Note that the OS-appropriate extension is automatically appended
 * @return	{DLL}
 */
function LoadDLL(filename){} //src/js_funcs.c:2297
/**
 * Returns a wrapper around a function call to a function in the given dynamically-loaded library.
 * Function arguments will all be translated as 32-bit integer values.
 * If an argument is a number, it will be converted to either an int32 or a float32.
 * Pointers, buffers, strings and objects (@Bitmap, @MIDI, etc.) will be passed as void *.
 * The function is thus assumed to have type "int func(int i1, int i2, ..., int in);"
 * @param	{DLL}		dll
 * @param	{String}	funcname
 * @param	{Integer}	nargs		-	Number of arguments (max 13)
 * @param	{Boolean}	numtype		-	If true, number arguments are treated as integers, otherwise as floats
 * @return	{Function}
 */
function GetDLLFunction(dll,funcname,nargs,numtype){} //src/js_funcs.c:2418
/**
 * Fetches a bitmap from the datafile.
 * Returns null on failures such as datafile object not found.
 * @param	{String}	objname
 * @return	{Bitmap}
 */
function GetDataBitmap(objname){} //src/js_funcs.c:2513
/**
 * Fetches a font from the datafile.
 * Returns null on failures such as datafile object not found.
 * @param	{String}	objname
 * @return	{Font}
 */
function GetDataFont(objname){} //src/js_funcs.c:2522
/**
 * Fetches a MIDI from the datafile.
 * Returns null on failures such as datafile object not found.
 * @param	{String}	objname
 * @return	{MIDI}
 */
function GetDataMIDI(objname){} //src/js_funcs.c:2531
/**
 * Fetches a sample from the datafile.
 * Returns null on failures such as datafile object not found.
 * @param	{String}	objname
 * @return	{Sample}
 */
function GetDataSample(objname){} //src/js_funcs.c:2540
/**
 * Fetches a string from the datafile.
 * Returns null on failures such as datafile object not found.
 * @param	{String}	objname
 * @return	{String}
 */
function GetDataString(objname){} //src/js_funcs.c:2549
/**
 * Fetches a buffer from the datafile.
 * Returns null on failures such as datafile object not found.
 * @param	{String}	objname
 * @return	{Buffer}
 */
function GetDataBuffer(objname){} //src/js_funcs.c:2559
/**
 * Starts capturing a GIF to a file.
 * Returns null on failures such as failure to open the file for writing.
 * @param	{String}	filename
 * @param	{Object}	params
 * @param	{Integer=}	params.width
 * @param	{Integer=}	params.height
 * @param	{Integer=}	params.repeat		-	0 loop forever, 1 play once and don't repeat, 2 repeat once, 3 repeat twice and so on
 * @param	{Integer=}	params.numColors	-	palette size 2 to 256, 256 won't allow delta frames (causing huge animated gifs)
 * @param	{Integer=}	params.fps
 * @param	{Integer=}	params.dither		-	0 no dither, 1 floyd-steinberg error diffusion dithering
 * @return	{Pointer}
 */
function GifCapStart(filename, params){} //src/js_funcs.c:2589
/**
 * Writes one frame to a GIF file.
 * @param	{Pointer}	gifcap
 * @param	{Bitmap}	bmp
 */
function GifCapFrame(gifcap, bmp){} //src/js_funcs.c:2638
/**
 * Finishes a GIF capture.
 * @param	{Pointer}	gifcap
 */
function GifCapEnd(gifcap){} //src/js_funcs.c:2651
/**
 * Draws a single frame from a gif. To play an animation frames must be drawn sequentially due to delta encoding.
 * @param	{Bitmap}	bmp		-	Destination
 * @param	{Buffer}	gif		-	A buffer containing a gif file, e.g. from {@ReadFile}
 * @param	{Integer}	frame
 */
function DrawGifFrame(bmp,gif,frame){} //src/js_funcs.c:2668
/**
 * Retrieves an array mapping frame index to delay, in centiseconds, to the following frame, for a gif.
 * @param	{Buffer}	gif		-	A buffer containing a gif file, e.g. from {@ReadFile}
 * @return	{Array}
 */
function GetGifDelays(gif){} //src/js_funcs.c:2687
/**
 * Allegro's BITMAP *. The target of all drawing routines.
 * @typedef		{Object}	Bitmap
 * @property	{Integer}	w		-	width
 * @property	{Integer}	h		-	width
 * @property	{Pointer}	ptr		-	Internal, so don't mess with it
 * @property	{Bitmap}	parent	-	Parent bitmap, if this is a subbitmap
 */
/**
 * Allegro's FONT *. Used for writing text into the screen and other bitmaps.
 * @typedef		{Object}	Font
 * @property	{Pointer}	ptr	-	Internal, so don't mess with it
 */
/**
 * Allegro's SAMPLE *. Digital audio samples, most often used for sound effects.
 * @typedef		{Object}	Sample
 * @property	{Integer}	bits	-	8 or 16
 * @property	{Integer}	stereo	-	0 mono, otherwise stereo
 * @property	{Integer}	freq	-	in Hz
 * @property	{Integer}	len		-	Number of samples
 * @property	{Pointer}	ptr		-	Internal, so don't mess with it
 */
/**
 * Allegro's MIDI *. For playing MIDI music, which is usually small in stored size.
 * @typedef		{Object}	MIDI
 * @property	{Pointer}	ptr	-	Internal, so don't mess with it
 */
/**
 * Allegro's COLOR_MAP *. Used for transparency and lighting effects in 8-bit color modes.
 * @typedef		{Object}	ColorMap
 * @property	{Pointer}	ptr	-	Internal, so don't mess with it
 */
/**
 * Handle for a dynamically-loaded library. Used to extend Tapegro functionality.
 * @typedef		{Object}	DLL
 * @property	{Pointer}	ptr	-	Internal, so don't mess with it
 */
