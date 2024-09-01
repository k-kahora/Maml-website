build:
	nix build 
rm_all_images:
	docker image ls | awk 'NR>1 { id=$3; print(id) }' | xargs docker image rm
	

info:
	poetry config --list # see where the dependices are actually installed

show:
	# Show all packages installed in your poetry packages
	poetry show
run:
	fastapi dev main.py