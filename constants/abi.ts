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
      "name": "core::byte_array::ByteArray",
      "type": "struct",
      "members": [
        {
          "name": "data",
          "type": "core::array::Array::<core::bytes_31::bytes31>"
        },
        {
          "name": "pending_word",
          "type": "core::felt252"
        },
        {
          "name": "pending_word_len",
          "type": "core::integer::u32"
        }
      ]
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
          "type": "core::byte_array::ByteArray"
        }
      ]
    },
    {
      "name": "core::integer::u256",
      "type": "struct",
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
      "name": "store::structs::Struct::CartItem",
      "type": "struct",
      "members": [
        {
          "name": "product_id",
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
      ]
    },
    {
      "name": "store::structs::Struct::PurchaseReceipt",
      "type": "struct",
      "members": [
        {
          "name": "buyer",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "name": "product_id",
          "type": "core::integer::u32"
        },
        {
          "name": "product_name",
          "type": "core::felt252"
        },
        {
          "name": "quantity",
          "type": "core::integer::u32"
        },
        {
          "name": "total_price_cents",
          "type": "core::integer::u32"
        },
        {
          "name": "total_price_tokens",
          "type": "core::integer::u256"
        },
        {
          "name": "timestamp",
          "type": "core::integer::u64"
        },
        {
          "name": "receipt_id",
          "type": "core::integer::u256"
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
              "type": "core::byte_array::ByteArray"
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
          "name": "buy_multiple_products",
          "type": "function",
          "inputs": [
            {
              "name": "cart_items",
              "type": "core::array::Array::<store::structs::Struct::CartItem>"
            },
            {
              "name": "total_payment_amount",
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
          "name": "get_token_address",
          "type": "function",
          "inputs": [],
          "outputs": [
            {
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "get_oracle_address",
          "type": "function",
          "inputs": [],
          "outputs": [
            {
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "get_contract_balance",
          "type": "function",
          "inputs": [],
          "outputs": [
            {
              "type": "core::integer::u256"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "withdraw_tokens",
          "type": "function",
          "inputs": [
            {
              "name": "amount",
              "type": "core::integer::u256"
            },
            {
              "name": "recipient",
              "type": "core::starknet::contract_address::ContractAddress"
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
          "name": "get_user_receipts",
          "type": "function",
          "inputs": [
            {
              "name": "user",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "core::array::Array::<core::integer::u256>"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "mint_receipt",
          "type": "function",
          "inputs": [
            {
              "name": "purchase_id",
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
          "name": "get_user_purchases",
          "type": "function",
          "inputs": [
            {
              "name": "user",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "core::array::Array::<core::integer::u256>"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "get_purchase_count",
          "type": "function",
          "inputs": [],
          "outputs": [
            {
              "type": "core::integer::u256"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "is_purchase_minted",
          "type": "function",
          "inputs": [
            {
              "name": "purchase_id",
              "type": "core::integer::u256"
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
          "name": "get_purchase_details",
          "type": "function",
          "inputs": [
            {
              "name": "purchase_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "store::structs::Struct::PurchaseReceipt"
            }
          ],
          "state_mutability": "view"
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
      "name": "openzeppelin_access::accesscontrol::interface::RoleStatus",
      "type": "enum",
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
          "name": "get_role_status",
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
              "type": "openzeppelin_access::accesscontrol::interface::RoleStatus"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "grant_role_with_delay",
          "type": "function",
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
      "name": "ERC721MetadataImpl",
      "type": "impl",
      "interface_name": "openzeppelin_token::erc721::interface::IERC721Metadata"
    },
    {
      "name": "openzeppelin_token::erc721::interface::IERC721Metadata",
      "type": "interface",
      "items": [
        {
          "name": "name",
          "type": "function",
          "inputs": [],
          "outputs": [
            {
              "type": "core::byte_array::ByteArray"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "symbol",
          "type": "function",
          "inputs": [],
          "outputs": [
            {
              "type": "core::byte_array::ByteArray"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "token_uri",
          "type": "function",
          "inputs": [
            {
              "name": "token_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::byte_array::ByteArray"
            }
          ],
          "state_mutability": "view"
        }
      ]
    },
    {
      "name": "ERC721Impl",
      "type": "impl",
      "interface_name": "openzeppelin_token::erc721::interface::IERC721"
    },
    {
      "name": "core::array::Span::<core::felt252>",
      "type": "struct",
      "members": [
        {
          "name": "snapshot",
          "type": "@core::array::Array::<core::felt252>"
        }
      ]
    },
    {
      "name": "openzeppelin_token::erc721::interface::IERC721",
      "type": "interface",
      "items": [
        {
          "name": "balance_of",
          "type": "function",
          "inputs": [
            {
              "name": "account",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "core::integer::u256"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "owner_of",
          "type": "function",
          "inputs": [
            {
              "name": "token_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "safe_transfer_from",
          "type": "function",
          "inputs": [
            {
              "name": "from",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "to",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "token_id",
              "type": "core::integer::u256"
            },
            {
              "name": "data",
              "type": "core::array::Span::<core::felt252>"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "transfer_from",
          "type": "function",
          "inputs": [
            {
              "name": "from",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "to",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "token_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "approve",
          "type": "function",
          "inputs": [
            {
              "name": "to",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "token_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "set_approval_for_all",
          "type": "function",
          "inputs": [
            {
              "name": "operator",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "approved",
              "type": "core::bool"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "name": "get_approved",
          "type": "function",
          "inputs": [
            {
              "name": "token_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "state_mutability": "view"
        },
        {
          "name": "is_approved_for_all",
          "type": "function",
          "inputs": [
            {
              "name": "owner",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "operator",
              "type": "core::starknet::contract_address::ContractAddress"
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
        },
        {
          "name": "oracle_address",
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
      "name": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGrantedWithDelay",
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
        },
        {
          "kind": "data",
          "name": "delay",
          "type": "core::integer::u64"
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
          "name": "RoleGrantedWithDelay",
          "type": "openzeppelin_access::accesscontrol::accesscontrol::AccessControlComponent::RoleGrantedWithDelay"
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
      "kind": "struct",
      "name": "openzeppelin_token::erc721::erc721::ERC721Component::Transfer",
      "type": "event",
      "members": [
        {
          "kind": "key",
          "name": "from",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "key",
          "name": "to",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "key",
          "name": "token_id",
          "type": "core::integer::u256"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "openzeppelin_token::erc721::erc721::ERC721Component::Approval",
      "type": "event",
      "members": [
        {
          "kind": "key",
          "name": "owner",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "key",
          "name": "approved",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "key",
          "name": "token_id",
          "type": "core::integer::u256"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "openzeppelin_token::erc721::erc721::ERC721Component::ApprovalForAll",
      "type": "event",
      "members": [
        {
          "kind": "key",
          "name": "owner",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "key",
          "name": "operator",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "approved",
          "type": "core::bool"
        }
      ]
    },
    {
      "kind": "enum",
      "name": "openzeppelin_token::erc721::erc721::ERC721Component::Event",
      "type": "event",
      "variants": [
        {
          "kind": "nested",
          "name": "Transfer",
          "type": "openzeppelin_token::erc721::erc721::ERC721Component::Transfer"
        },
        {
          "kind": "nested",
          "name": "Approval",
          "type": "openzeppelin_token::erc721::erc721::ERC721Component::Approval"
        },
        {
          "kind": "nested",
          "name": "ApprovalForAll",
          "type": "openzeppelin_token::erc721::erc721::ERC721Component::ApprovalForAll"
        }
      ]
    },
    {
      "kind": "struct",
      "name": "store::Events::Events::PurchaseMade",
      "type": "event",
      "members": [
        {
          "kind": "data",
          "name": "buyer",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "kind": "data",
          "name": "product_id",
          "type": "core::integer::u32"
        },
        {
          "kind": "data",
          "name": "product_name",
          "type": "core::felt252"
        },
        {
          "kind": "data",
          "name": "quantity",
          "type": "core::integer::u32"
        },
        {
          "kind": "data",
          "name": "total_price_cents",
          "type": "core::integer::u32"
        },
        {
          "kind": "data",
          "name": "total_price_tokens",
          "type": "core::integer::u256"
        },
        {
          "kind": "data",
          "name": "timestamp",
          "type": "core::integer::u64"
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
        },
        {
          "kind": "flat",
          "name": "ERC721Event",
          "type": "openzeppelin_token::erc721::erc721::ERC721Component::Event"
        },
        {
          "kind": "nested",
          "name": "PurchaseMade",
          "type": "store::Events::Events::PurchaseMade"
        }
      ]
    }
  ]
]