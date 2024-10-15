{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
    fenix.url = "github:nix-community/fenix";
    fenix.inputs.nixpkgs.follows = "nixpkgs";
    devenv.url = "github:cachix/devenv";
  };

  outputs = inputs@{ flake-parts, nixpkgs, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      imports = [ inputs.devenv.flakeModule ];
      systems = nixpkgs.lib.systems.flakeExposed;

      perSystem = { config, lib, self', inputs', pkgs, system, ... }: {
        devenv.shells.default = {
          packages = lib.optionals pkgs.stdenv.isDarwin [ pkgs.darwin.apple_sdk_12_3.frameworks.SystemConfiguration ];

          languages.rust = {
            enable = true;
            channel = "stable";
          };

          languages.javascript = {
            enable = true;
            directory = "./frontend";
            pnpm.enable = true;
          };
        };
      };
    };
}
