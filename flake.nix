

  


{
  description = "A simple poetry project";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    poetry2nix.url = "github:nix-community/poetry2nix";
  };

  outputs = { self, nixpkgs, flake-utils, poetry2nix }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        nodePackages = pkgs.nodePackages;
        inherit (poetry2nix.lib.mkPoetry2Nix { inherit pkgs; }) mkPoetryApplication mkPoetryEnv;

        project-new = mkPoetryApplication {
          projectDir = ./.; # Replace with actual project directory
        };
        dep-env = mkPoetryEnv {
          projectDir = ./.; # Replace with actual project directory
        };

        dockerImage = pkgs.dockerTools.buildImage {
          name = "my-flake-docker-image";
          tag = "latest";
          config = {
            cmd = [ "${project-new}/bin/runner" ];
          };
        };

      in {
        packages = {
          inherit project-new;
          docker = dockerImage;
        };
        defaultPackage = dockerImage;
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [dep-env poetry python3Packages.fastapi python3Packages.uvicorn
            nodePackages.vscode-langservers-extracted

];
         };
      });
}
