module.exports = (
  username,
  url,
) => `<!DOCTYPE html html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Static Template</title>
  </head>
  <body style="margin: 0; padding: 0; background-color:#edeff0 ">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding: 40px 0 30px 0">
          <table
            align="center"
            border="0"
            cellpadding="1"
            cellspacing="0"
            width="600"
            style="border-collapse: collapse;"
          >
            <tr>
              <td
                bgcolor="#ffffff"
                align="center"
                style="padding: 40px 0 30px 0;"
              >
                <img
                  src="http://Bworks.online/images/logo.png"
                  alt="Tạo mật khẩu mới"
                  style="display: block; height: auto; width: auto; max-height: 100px; max-width: 200px"
                />
              </td>
            </tr>
            <tr>
              <td bgcolor="#ffffff" style="padding: 10px 10px 40px 30px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td
                      style="color: #153643; font-family: Arial, sans serif; font-size: 16px; line-height: 20px"
                    >
                      Xin chào <b style="font-size: 20px;">${username}</b>. Hãy nhấp vào nút dưới để tiến hành
                      tạo mật khẩu mới.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <!-- Button -->
                      <center>
                        <table
                          align="center"
                          cellspacing="0"
                          cellpadding="0"
                          width="100%"
                        >
                          <tr>
                            <td align="center" style="padding: 20px;">
                              <table
                                border="0"
                                class="mobile-button"
                                cellspacing="0"
                                cellpadding="0"
                              >
                                <tr>
                                  <td
                                    align="center"
                                    bgcolor="#3980d2"
                                    style="background-color: #3980d2; margin: auto; max-width: 300px; -webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; padding: 10px 15px; "
                                    width="100%"
                                  >
                                    <!--[if mso]>&nbsp;<![endif]-->
                                    <a
                                      href="${url}"
                                      target="_blank"
                                      style="16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; font-weight:normal; text-align:center; background-color: #3980d2; text-decoration: none; border: none; -webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; display: inline-block;"
                                    >
                                      <span
                                        style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; font-weight:normal; line-height:1.5em; text-align:center;"
                                        >Tạo mật khẩu mới</span
                                      >
                                    </a>
                                    <!--[if mso]>&nbsp;<![endif]-->
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </center>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td bgcolor="#edeff0" style="padding: 30px 30px 30px 30px;">
                <table
                  border="0"
                  cellpadding="0"
                  width="100%"
                  style="border-collapse:collapse"
                >
                  <tr>
                    <td
                      align="center"
                      style="font-family: Arial, sans serif; font-size: 14px; line-height: 20px"
                    >
                      &reg; 2022 Bworks
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
