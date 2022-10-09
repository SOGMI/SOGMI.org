- add paypal button support
```html
<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
	<input type="hidden" name="cmd" value="_s-xclick">
	<input type="hidden" name="hosted_button_id" value="Z9CZTFUCXL5GG">
	<table>
		<tr><td>
			<input type="hidden" name="on0" value="Are you attending online? (Out of town only)">Are you attending online? (Out of town only)</td></tr><tr><td>
			<select name="os0">
				<option value="No">No </option>
			<option value="Yes">Yes </option>
			</select> 
		</td></tr>
		<tr><td>
			<input type="hidden" name="on1" value="What is your email address?">What is your email address?</td></tr><tr><td>
			<input type="text" name="os1" maxlength="200"></td></tr>
	</table>
	<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
	<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
</form>
```