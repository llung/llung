<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<?php /$vid = $_REQUEST['vid']; ?>
	<title></title>
	<style type="text/css">
		BODY{
			margin: 0px;
		}
	</style>
</head>
<body>
	<iframe src="http://www.lynda.com/home/VideoPlayer.aspx?lpk4=<?php echo $vid; ?>" width="960" height="555" style="overflow: hidden;" frameborder="0" scrolling="no"></iframe>
</body>
</html>