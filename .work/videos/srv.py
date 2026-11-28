import http.server, os, sys
os.chdir(sys.argv[1])
class H(http.server.SimpleHTTPRequestHandler):
    def send_error(self, code, *a, **k):
        if code==404:
            b=open("404.html","rb").read(); self.send_response(404); self.send_header("Content-Type","text/html; charset=utf-8"); self.end_headers(); self.wfile.write(b)
        else: super().send_error(code,*a,**k)
    def log_message(self,*a): pass
http.server.ThreadingHTTPServer(("",int(sys.argv[2])),H).serve_forever()
