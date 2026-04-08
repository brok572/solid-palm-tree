export default functionexport default function handler(req, res) {
  res.status(200).send(`
    <html>
      <head>
        <title>Nexus Video API</title>
        <style>
          body{
            margin:0;
            padding:0;
            font-family:system-ui;
            background:#020617;
            color:#e5e7eb;
            display:flex;
            align-items:center;
            justify-content:center;
            height:100vh;
          }
          .box{
            background:#020617;
            border-radius:16px;
            border:1px solid #4f46e5;
            padding:24px 28px;
            max-width:420px;
            text-align:center;
          }
          h1{font-size:22px;margin-bottom:8px;color:#a855f7;}
          p{font-size:14px;color:#9ca3af;margin:4px 0;}
          code{background:#020617;border-radius:8px;padding:4px 8px;display:inline-block;margin-top:8px;}
        </style>
      </head>
      <body>
        <div class="box">
          <h1>Nexus Video API</h1>
          <p>API is running on Vercel.</p>
          <p>POST images to:</p>
          <code>/api/makevideo</code>
        </div>
      </body>
    </html>
  `);
}￼Enter
