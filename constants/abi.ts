export const StoreAbi = [
  [
    {
      "type": "function",
      "name": "pause",
      "inputs": [],
      "outputs": [],
      "state_mutability": "external"
    },
    {
      "type": "function",
      "name": "unpause",
      "inputs": [],
      "outputs": [],
      "state_mutability": "external"
    },
    {
      "type": "impl",
      "name": "UpgradeableImpl",
      "interface_name": "openzeppelin_upgrades::interface::IUpgradeable"
    },
    {
      "type": "interface",
      "name": "openzeppelin_upgrades::interface::IUpgradeable",
      "items": [
        {
          "type": "function",
          "name": "upgrade",
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
      "type": "impl",
      "name": "StoreImpl",
      "interface_name": "store::interfaces::Istore::IStore"
    },
    {
      "type": "struct",
      "name": "store::structs::Struct::Items",
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
      "type": "struct",
      "name": "core::integer::u256",
      "members": [
        {
          "name": "low",
          "type": "core::integer::u128"
        },
        {
          "name": "high",
          "type": "core::integer::u128"
        }
      ]
    },
    {
      "type": "enum",
      "name": "core::bool",
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
      "type": "interface",
      "name": "store::interfaces::Istore::IStore",
      "items": [
        {
          "type": "function",
          "name": "add_item",
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
          "type": "function",
          "name": "get_item",
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
          "type": "function",
          "name": "get_total_items",
          "inputs": [],
          "outputs": [
            {
              "type": "core::integer::u32"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "get_all_items",
          "inputs": [],
          "outputs": [
            {
              "type": "core::array::Array::<store::structs::Struct::Items>"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "buy_product",
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
            },
            {
              "name": "payment_amount",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::bool"
            }
          ],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "get_token_address",
          "inputs": [],
          "outputs": [
            {
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "get_oracle_address",
          "inputs": [],
          "outputs": [
            {
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "state_mutability": "view"
        }
      ]
    },
    {
      "type": "impl",
      "name": "PausableImpl",
      "interface_name": "openzeppelin_security::interface::IPausable"
    },
    {
      "type": "interface",
      "name": "openzeppelin_security::interface::IPausable",
      "items": [
        {
          "type": "function",
          "name": "is_paused",
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
      "type": "impl",
      "name": "AccessControlMixinImpl",
      "interface_name": "openzeppelin_access::accesscontrol::interface::AccessControlABI"
    },
    {
      "type": "enum",
      "name": "openzeppelin_access::accesscontrol::interface::RoleStatus",
      "variants": [
        {
          "name": "NotGranted",
          "type": "()"
        },
        {
          "name": "Delayed",
          "type": "core::integer::u64"
        },
        {
          "name": "Effective",
          "type": "()"
        }
      ]
    },
    {
      "type": "interface",
      "name": "openzeppelin_access::accesscontrol::interface::AccessControlABI",
      "items": [
        {
          "type": "function",
          "name": "has_role",
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
          "type": "function",
          "name": "get_role_admin",
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
          "type": "function",
          "name": "grant_role",
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
          "type": "function",
          "name": "revoke_role",
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
          "type": "function",
          "name": "renounce_role",
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
          "type": "function",
          "name": "hasRole",
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
          "type": "function",
          "name": "getRoleAdmin",
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
          "type": "function",
          "name": "grantRole",
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
          "type": "function",
          "name": "revokeRole",
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
          "type": "function",
          "name": "renounceRole",
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
          "type": "function",
          "name": "get_role_status",
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
              "type": "openzeppelin_access::accesscontrol::interface::RoleStatus"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "grant_role_with_delay",
          "inputs": [
            {
              "name": "role",
              "type": "core::felt252"
            },
            {
              "name": "account",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "delay",
              "type": "core::integer::u64"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "supports_interface",
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
      "type": "constructor",
      "name": "constructor",
      "inputs": [
        {
          "name": "default_admin",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "name": "token_address",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "name": "oracle_address",
          "type": "core::starknet::contract_address::ContractAddress"
        }
      ]
    },
    {
      "type": "event",
      "name": "openzeppelin_security::pausable::PausableComponent::Paused",
      "kind": "struct",
      "members": [
        {
          "name": "account",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "data"
        }
      ]
    },
    {
      "type": "event",
      "name": "openzeppelin_security::pausable::PausableComponent::Unpaused",
      "kind": "struct",
      "members": [
        {
          "name": "account",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "data"
        }
      ]
    },
    {
      "type": "event",
      "name": "openzeppelin_security::pausable::PausableComponent::Event",
      "kind": "enum",
      "variants": [
        {
          "name": "Paused",
          "type": "openzeppelin_security::pausable::PausableComponent::Paused",
          "kind": "nested"
        },
        {
          "name": "Unpaused",
          "type": "openzeppelin_security::pausable::PausableComponent::Unpaused",
          "kind": "nested"
        }
      ]
    },
    {
      "type": "event",
      "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGranted",
      "kind": "struct",
      "members": [
        {
          "name": "role",
          "type": "core::felt252",
          "kind": "data"
        },
        {
          "name": "account",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "data"
        },
        {
          "name": "sender",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "data"
        }
      ]
    },
    {
      "type": "event",
      "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGrantedWithDelay",
      "kind": "struct",
      "members": [
        {
          "name": "role",
          "type": "core::felt252",
          "kind": "data"
        },
        {
          "name": "account",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "data"
        },
        {
          "name": "sender",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "data"
        },
        {
          "name": "delay",
          "type": "core::integer::u64",
          "kind": "data"
        }
      ]
    },
    {
      "type": "event",
      "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleRevoked",
      "kind": "struct",
      "members": [
        {
          "name": "role",
          "type": "core::felt252",
          "kind": "data"
        },
        {
          "name": "account",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "data"
        },
        {
          "name": "sender",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "data"
        }
      ]
    },
    {
      "type": "event",
      "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleAdminChanged",
      "kind": "struct",
      "members": [
        {
          "name": "role",
          "type": "core::felt252",
          "kind": "data"
        },
        {
          "name": "previous_admin_role",
          "type": "core::felt252",
          "kind": "data"
        },
        {
          "name": "new_admin_role",
          "type": "core::felt252",
          "kind": "data"
        }
      ]
    },
    {
      "type": "event",
      "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::Event",
      "kind": "enum",
      "variants": [
        {
          "name": "RoleGranted",
          "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGranted",
          "kind": "nested"
        },
        {
          "name": "RoleGrantedWithDelay",
          "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGrantedWithDelay",
          "kind": "nested"
        },
        {
          "name": "RoleRevoked",
          "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleRevoked",
          "kind": "nested"
        },
        {
          "name": "RoleAdminChanged",
          "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleAdminChanged",
          "kind": "nested"
        }
      ]
    },
    {
      "type": "event",
      "name": "openzeppelin_introspection::src5::SRC5Component::Event",
      "kind": "enum",
      "variants": []
    },
    {
      "type": "event",
      "name": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
      "kind": "struct",
      "members": [
        {
          "name": "class_hash",
          "type": "core::starknet::class_hash::ClassHash",
          "kind": "data"
        }
      ]
    },
    {
      "type": "event",
      "name": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
      "kind": "enum",
      "variants": [
        {
          "name": "Upgraded",
          "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
          "kind": "nested"
        }
      ]
    },
    {
      "type": "event",
      "name": "store::Events::Events::PurchaseMade",
      "kind": "struct",
      "members": [
        {
          "name": "buyer",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "data"
        },
        {
          "name": "product_id",
          "type": "core::integer::u32",
          "kind": "data"
        },
        {
          "name": "product_name",
          "type": "core::felt252",
          "kind": "data"
        },
        {
          "name": "quantity",
          "type": "core::integer::u32",
          "kind": "data"
        },
        {
          "name": "total_price_cents",
          "type": "core::integer::u32",
          "kind": "data"
        },
        {
          "name": "total_price_tokens",
          "type": "core::integer::u256",
          "kind": "data"
        },
        {
          "name": "timestamp",
          "type": "core::integer::u64",
          "kind": "data"
        }
      ]
    },
    {
      "type": "event",
      "name": "store::contract::store::Store::Event",
      "kind": "enum",
      "variants": [
        {
          "name": "PausableEvent",
          "type": "openzeppelin_security::pausable::PausableComponent::Event",
          "kind": "flat"
        },
        {
          "name": "AccessControlEvent",
          "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::Event",
          "kind": "flat"
        },
        {
          "name": "SRC5Event",
          "type": "openzeppelin_introspection::src5::SRC5Component::Event",
          "kind": "flat"
        },
        {
          "name": "UpgradeableEvent",
          "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
          "kind": "flat"
        },
        {
          "name": "PurchaseMade",
          "type": "store::Events::Events::PurchaseMade",
          "kind": "nested"
        }
      ]
    }
  ]
]