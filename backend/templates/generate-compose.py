from jinja2 import Environment, FileSystemLoader
from Crypto.PublicKey import RSA
import os
import sys

if __name__ == '__main__':
    origin = sys.argv[1]

    # compose file
    env = Environment(loader=FileSystemLoader("./templates"))
    template = env.get_template("docker-compose.yml.j2")
    f_template = open("docker-compose.yml", "w")
    f_template.write(template.render(build_images=True))
    print("Wrote docker-compose.yml")

    # nginx config
    template = env.get_template("nginx.conf.j2")
    f_template = open("./configs/nginx.conf", "w")
    f_template.write(template.render(origin=origin))
    print("Wrote nginx.conf")


    # env file
    key = RSA.generate(2048, os.urandom)
    pem = key.export_key("PEM")
    template = env.get_template("env.j2")
    f_template = open(".env", "w")
    f_template.write(template.render(origin=origin, keypair=str(pem)[2:-1]))
    print("Wrote .env")
