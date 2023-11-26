from jinja2 import Environment, FileSystemLoader
from Crypto.PublicKey import RSA
import os
import sys

if __name__ == '__main__':
    # compose file
    env = Environment(loader=FileSystemLoader("./templates"))
    template = env.get_template("docker-compose.yaml.j2")
    f_template = open("docker-compose.yaml", "w")
    f_template.write(template.render(build_images=True))
    print("Wrote docker-compose.yaml")
