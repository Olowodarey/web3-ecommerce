export const StoreAbi = [
    [
        {
          "name": "pause",
          "type": "function",
          "inputs": [],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "unpause",
          "type": "function",
          "inputs": [],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "UpgradeableImpl",
          "type": "impl",
          "interface_name": "openzeppelin_upgrades::interface::IUpgradeable"
        },
        {
          "name": "openzeppelin_upgrades::interface::IUpgradeable",
          "type": "interface",
          "items": [
            {
              "name": "upgrade",
              "type": "function",
              "inputs": [
                {
                  "name": "new_class_hash",
                  "type": "core::starknet::class_hash::ClassHash"
                }
              ],
              "outputs": [],
              "state_mutability": "external"
            }
          ]
        },
        {
          "name": "StoreImpl",
          "type": "impl",
          "interface_name": "store::interfaces::Istore::IStore"
        },
        {
          "name": "store::structs::Struct::Items",
          "type": "struct",
          "members": [
            {
              "name": "id",
              "type": "core::integer::u32"
            },
            {
              "name": "productname",
              "type": "core::felt252"
            },
            {
              "name": "price",
              "type": "core::integer::u32"
            },
            {
              "name": "quantity",
              "type": "core::integer::u32"
            },
            {
              "name": "Img",
              "type": "core::felt252"
            }
          ]
        },
        {
          "name": "core::bool",
          "type": "enum",
          "variants": [
            {
              "name": "False",
              "type": "()"
            },
            {
              "name": "True",
              "type": "()"
            }
          ]
        },
        {
          "name": "store::interfaces::Istore::IStore",
          "type": "interface",
          "items": [
            {
              "name": "add_item",
              "type": "function",
              "inputs": [
                {
                  "name": "productname",
                  "type": "core::felt252"
                },
                {
                  "name": "price",
                  "type": "core::integer::u32"
                },
                {
                  "name": "quantity",
                  "type": "core::integer::u32"
                },
                {
                  "name": "Img",
                  "type": "core::felt252"
                }
              ],
              "outputs": [],
              "state_mutability": "external"
            },
            {
              "name": "get_item",
              "type": "function",
              "inputs": [
                {
                  "name": "productId",
                  "type": "core::integer::u32"
                }
              ],
              "outputs": [
                {
                  "type": "store::structs::Struct::Items"
                }
              ],
              "state_mutability": "view"
            },
            {
              "name": "get_total_items",
              "type": "function",
              "inputs": [],
              "outputs": [
                {
                  "type": "core::integer::u32"
                }
              ],
              "state_mutability": "view"
            },
            {
              "name": "get_all_items",
              "type": "function",
              "inputs": [],
              "outputs": [
                {
                  "type": "core::array::Array::<store::structs::Struct::Items>"
                }
              ],
              "state_mutability": "view"
            },
            {
              "name": "buy_product",
              "type": "function",
              "inputs": [
                {
                  "name": "productId",
                  "type": "core::integer::u32"
                },
                {
                  "name": "quantity",
                  "type": "core::integer::u32"
                },
                {
                  "name": "expected_price",
                  "type": "core::integer::u32"
                }
              ],
              "outputs": [
                {
                  "type": "core::bool"
                }
              ],
              "state_mutability": "external"
            }
          ]
        },
        {
          "name": "PausableImpl",
          "type": "impl",
          "interface_name": "openzeppelin_security::interface::IPausable"
        },
        {
          "name": "openzeppelin_security::interface::IPausable",
          "type": "interface",
          "items": [
            {
              "name": "is_paused",
              "type": "function",
              "inputs": [],
              "outputs": [
                {
                  "type": "core::bool"
                }
              ],
              "state_mutability": "view"
            }
          ]
        },
        {
          "name": "AccessControlMixinImpl",
          "type": "impl",
          "interface_name": "openzeppelin_access::accesscontrol::interface::AccessControlABI"
        },
        {
          "name": "openzeppelin_access::accesscontrol::interface::AccessControlABI",
          "type": "interface",
          "items": [
            {
              "name": "has_role",
              "type": "function",
              "inputs": [
                {
                  "name": "role",
                  "type": "core::felt252"
                },
                {
                  "name": "account",
                  "type": "core::starknet::contract_address::ContractAddress"
                }
              ],
              "outputs": [
                {
                  "type": "core::bool"
                }
              ],
              "state_mutability": "view"
            },
            {
              "name": "get_role_admin",
              "type": "function",
              "inputs": [
                {
                  "name": "role",
                  "type": "core::felt252"
                }
              ],
              "outputs": [
                {
                  "type": "core::felt252"
                }
              ],
              "state_mutability": "view"
            },
            {
              "name": "grant_role",
              "type": "function",
              "inputs": [
                {
                  "name": "role",
                  "type": "core::felt252"
                },
                {
                  "name": "account",
                  "type": "core::starknet::contract_address::ContractAddress"
                }
              ],
              "outputs": [],
              "state_mutability": "external"
            },
            {
              "name": "revoke_role",
              "type": "function",
              "inputs": [
                {
                  "name": "role",
                  "type": "core::felt252"
                },
                {
                  "name": "account",
                  "type": "core::starknet::contract_address::ContractAddress"
                }
              ],
              "outputs": [],
              "state_mutability": "external"
            },
            {
              "name": "renounce_role",
              "type": "function",
              "inputs": [
                {
                  "name": "role",
                  "type": "core::felt252"
                },
                {
                  "name": "account",
                  "type": "core::starknet::contract_address::ContractAddress"
                }
              ],
              "outputs": [],
              "state_mutability": "external"
            },
            {
              "name": "hasRole",
              "type": "function",
              "inputs": [
                {
                  "name": "role",
                  "type": "core::felt252"
                },
                {
                  "name": "account",
                  "type": "core::starknet::contract_address::ContractAddress"
                }
              ],
              "outputs": [
                {
                  "type": "core::bool"
                }
              ],
              "state_mutability": "view"
            },
            {
              "name": "getRoleAdmin",
              "type": "function",
              "inputs": [
                {
                  "name": "role",
                  "type": "core::felt252"
                }
              ],
              "outputs": [
                {
                  "type": "core::felt252"
                }
              ],
              "state_mutability": "view"
            },
            {
              "name": "grantRole",
              "type": "function",
              "inputs": [
                {
                  "name": "role",
                  "type": "core::felt252"
                },
                {
                  "name": "account",
                  "type": "core::starknet::contract_address::ContractAddress"
                }
              ],
              "outputs": [],
              "state_mutability": "external"
            },
            {
              "name": "revokeRole",
              "type": "function",
              "inputs": [
                {
                  "name": "role",
                  "type": "core::felt252"
                },
                {
                  "name": "account",
                  "type": "core::starknet::contract_address::ContractAddress"
                }
              ],
              "outputs": [],
              "state_mutability": "external"
            },
            {
              "name": "renounceRole",
              "type": "function",
              "inputs": [
                {
                  "name": "role",
                  "type": "core::felt252"
                },
                {
                  "name": "account",
                  "type": "core::starknet::contract_address::ContractAddress"
                }
              ],
              "outputs": [],
              "state_mutability": "external"
            },
            {
              "name": "supports_interface",
              "type": "function",
              "inputs": [
                {
                  "name": "interface_id",
                  "type": "core::felt252"
                }
              ],
              "outputs": [
                {
                  "type": "core::bool"
                }
              ],
              "state_mutability": "view"
            }
          ]
        },
        {
          "name": "constructor",
          "type": "constructor",
          "inputs": [
            {
              "name": "default_admin",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "token_address",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ]
        },
        {
          "kind": "struct",
          "name": "openzeppelin_security::pausable::PausableComponent::Paused",
          "type": "event",
          "members": [
            {
              "kind": "data",
              "name": "account",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ]
        },
        {
          "kind": "struct",
          "name": "openzeppelin_security::pausable::PausableComponent::Unpaused",
          "type": "event",
          "members": [
            {
              "kind": "data",
              "name": "account",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ]
        },
        {
          "kind": "enum",
          "name": "openzeppelin_security::pausable::PausableComponent::Event",
          "type": "event",
          "variants": [
            {
              "kind": "nested",
              "name": "Paused",
              "type": "openzeppelin_security::pausable::PausableComponent::Paused"
            },
            {
              "kind": "nested",
              "name": "Unpaused",
              "type": "openzeppelin_security::pausable::PausableComponent::Unpaused"
            }
          ]
        },
        {
          "kind": "struct",
          "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGranted",
          "type": "event",
          "members": [
            {
              "kind": "data",
              "name": "role",
              "type": "core::felt252"
            },
            {
              "kind": "data",
              "name": "account",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "kind": "data",
              "name": "sender",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ]
        },
        {
          "kind": "struct",
          "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleRevoked",
          "type": "event",
          "members": [
            {
              "kind": "data",
              "name": "role",
              "type": "core::felt252"
            },
            {
              "kind": "data",
              "name": "account",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "kind": "data",
              "name": "sender",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ]
        },
        {
          "kind": "struct",
          "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleAdminChanged",
          "type": "event",
          "members": [
            {
              "kind": "data",
              "name": "role",
              "type": "core::felt252"
            },
            {
              "kind": "data",
              "name": "previous_admin_role",
              "type": "core::felt252"
            },
            {
              "kind": "data",
              "name": "new_admin_role",
              "type": "core::felt252"
            }
          ]
        },
        {
          "kind": "enum",
          "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::Event",
          "type": "event",
          "variants": [
            {
              "kind": "nested",
              "name": "RoleGranted",
              "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGranted"
            },
            {
              "kind": "nested",
              "name": "RoleRevoked",
              "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleRevoked"
            },
            {
              "kind": "nested",
              "name": "RoleAdminChanged",
              "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleAdminChanged"
            }
          ]
        },
        {
          "kind": "enum",
          "name": "openzeppelin_introspection::src5::SRC5Component::Event",
          "type": "event",
          "variants": []
        },
        {
          "kind": "struct",
          "name": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
          "type": "event",
          "members": [
            {
              "kind": "data",
              "name": "class_hash",
              "type": "core::starknet::class_hash::ClassHash"
            }
          ]
        },
        {
          "kind": "enum",
          "name": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
          "type": "event",
          "variants": [
            {
              "kind": "nested",
              "name": "Upgraded",
              "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded"
            }
          ]
        },
        {
          "kind": "enum",
          "name": "store::contract::store::Store::Event",
          "type": "event",
          "variants": [
            {
              "kind": "flat",
              "name": "PausableEvent",
              "type": "openzeppelin_security::pausable::PausableComponent::Event"
            },
            {
              "kind": "flat",
              "name": "AccessControlEvent",
              "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::Event"
            },
            {
              "kind": "flat",
              "name": "SRC5Event",
              "type": "openzeppelin_introspection::src5::SRC5Component::Event"
            },
            {
              "kind": "flat",
              "name": "UpgradeableEvent",
              "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event"
            }
          ]
        }
      ]
]