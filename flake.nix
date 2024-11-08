{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/master";
    flake-parts.url = "github:hercules-ci/flake-parts";
    fenix.url = "github:nix-community/fenix";
    fenix.inputs.nixpkgs.follows = "nixpkgs";
    devenv.url = "github:cachix/devenv";
  };

  outputs = inputs@{ flake-parts, nixpkgs, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      imports = [ inputs.devenv.flakeModule ];
      systems = nixpkgs.lib.systems.flakeExposed;

      perSystem = { lib, pkgs, ... }: {
        devenv.shells.default = {
          packages = lib.optionals pkgs.stdenv.isDarwin [ pkgs.apple-sdk_12 ]
            ++ lib.optionals pkgs.stdenv.isLinux [ pkgs.openssl ];

          languages.rust = {
            enable = true;
            channel = "nightly";
          };

          languages.javascript = {
            enable = true;
            directory = "./frontend";
            pnpm.enable = true;
          };

          languages.deno.enable = true;
        };
      };
    };
}
