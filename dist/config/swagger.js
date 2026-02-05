"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const makeErrorResponse = (description) => ({
    description,
    content: {
        'application/json': {
            schema: {
                $ref: '#/components/schemas/ErrorResponse'
            }
        }
    }
});
const swaggerDocument = {
    openapi: '3.0.3',
    info: {
        title: 'RPGist API',
        version: '0.1.0',
        description: 'API documentation for the RPGist backend service.'
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Local development server'
        }
    ],
    paths: {
        '/health': {
            get: {
                summary: 'Health check',
                tags: ['Health'],
                responses: {
                    '200': {
                        description: 'Service is up and running',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: {
                                            type: 'string',
                                            example: 'ok'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/auth/register': {
            post: {
                summary: 'Register a new user',
                description: 'Creates a user account and returns an authentication token.',
                tags: ['Auth'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AuthCredentials'
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'User created successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/AuthResponse'
                                }
                            }
                        }
                    },
                    '409': makeErrorResponse('Email already registered')
                }
            }
        },
        '/api/auth/login': {
            post: {
                summary: 'Authenticate user credentials',
                description: 'Validates credentials and returns a JWT token.',
                tags: ['Auth'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/AuthCredentials'
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Authentication successful',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/AuthResponse'
                                }
                            }
                        }
                    },
                    '401': makeErrorResponse('Invalid credentials')
                }
            }
        },
        '/api/users/me': {
            get: {
                summary: 'Current authenticated user',
                description: 'Returns profile information for the authenticated user.',
                tags: ['Users'],
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'User profile',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/UserResponse'
                                }
                            }
                        }
                    },
                    '401': makeErrorResponse('Authentication required')
                }
            },
            patch: {
                summary: 'Update current user',
                description: 'Updates the authenticated user profile. Only the account owner may modify their name, email, or password.',
                tags: ['Users'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/UserUpdateRequest'
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'User updated successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/UserResponse'
                                }
                            }
                        }
                    },
                    '400': makeErrorResponse('Validation failed'),
                    '401': makeErrorResponse('Authentication required'),
                    '409': makeErrorResponse('Email already registered by another user')
                }
            },
            delete: {
                summary: 'Delete current user',
                description: 'Deletes the authenticated user account. This action cascades to owned characters, games, and memberships.',
                tags: ['Users'],
                security: [{ bearerAuth: [] }],
                responses: {
                    '204': {
                        description: 'User account deleted successfully'
                    },
                    '401': makeErrorResponse('Authentication required'),
                    '404': makeErrorResponse('User not found')
                }
            }
        },
        '/api/games': {
            post: {
                summary: 'Create a game',
                description: 'Create a tabletop campaign owned by the authenticated user (the DM).',
                tags: ['Games'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/GameRequest'
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Game created successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/GameResponse'
                                }
                            }
                        }
                    },
                    '401': makeErrorResponse('Authentication required')
                }
            },
            get: {
                summary: 'List owned games',
                description: 'Returns games where the authenticated user is the owner/DM.',
                tags: ['Games'],
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Owned games',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/GamesResponse'
                                }
                            }
                        }
                    },
                    '401': makeErrorResponse('Authentication required')
                }
            }
        },
        '/api/games/{id}': {
            get: {
                summary: 'Get a game by id',
                description: 'Loads a single game owned by the authenticated user.',
                tags: ['Games'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                            format: 'uuid'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Game details',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/GameResponse'
                                }
                            }
                        }
                    },
                    '401': makeErrorResponse('Authentication required'),
                    '404': makeErrorResponse('Game not found')
                }
            },
            patch: {
                summary: 'Update game',
                description: 'Updates game metadata. Only the game owner (DM) may modify name, description, or status.',
                tags: ['Games'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                            format: 'uuid'
                        }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/GameUpdateRequest'
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Game updated successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/GameResponse'
                                }
                            }
                        }
                    },
                    '400': makeErrorResponse('Validation failed'),
                    '401': makeErrorResponse('Authentication required'),
                    '403': makeErrorResponse('User is not the game owner'),
                    '404': makeErrorResponse('Game not found')
                }
            },
            delete: {
                summary: 'Delete game',
                description: 'Deletes the game and cascades memberships. Only the game owner (DM) may perform this action.',
                tags: ['Games'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                            format: 'uuid'
                        }
                    }
                ],
                responses: {
                    '204': {
                        description: 'Game deleted successfully'
                    },
                    '401': makeErrorResponse('Authentication required'),
                    '403': makeErrorResponse('User is not the game owner'),
                    '404': makeErrorResponse('Game not found')
                }
            }
        },
        '/api/game-characters': {
            post: {
                summary: 'Request to join a game',
                description: 'Submit a character to participate in a game. Only the character owner can request participation.',
                tags: ['Game Characters'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/GameCharacterJoinRequest'
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Join request created',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/GameCharacterResponse'
                                }
                            }
                        }
                    },
                    '400': makeErrorResponse('Invalid payload'),
                    '401': makeErrorResponse('Authentication required'),
                    '404': makeErrorResponse('Game or character not found'),
                    '409': makeErrorResponse('Duplicate or conflicting request')
                }
            },
            get: {
                summary: 'List game memberships',
                description: 'Returns memberships for the authenticated user. Provide gameId to list all characters pending/approved in a specific owned game.',
                tags: ['Game Characters'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'query',
                        name: 'gameId',
                        required: false,
                        schema: {
                            type: 'string',
                            format: 'uuid'
                        },
                        description: 'Optional game identifier. Requires the authenticated user to be the game owner.'
                    }
                ],
                responses: {
                    '200': {
                        description: 'Membership list',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/GameCharacterListResponse'
                                }
                            }
                        }
                    },
                    '400': makeErrorResponse('Invalid query parameter'),
                    '401': makeErrorResponse('Authentication required'),
                    '404': makeErrorResponse('Game not found or inaccessible')
                }
            }
        },
        '/api/game-characters/{id}': {
            get: {
                summary: 'Get membership details',
                description: 'Fetch participation information for a single membership. Accessible to the character owner or game master.',
                tags: ['Game Characters'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                            format: 'uuid'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Membership details',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/GameCharacterResponse'
                                }
                            }
                        }
                    },
                    '401': makeErrorResponse('Authentication required'),
                    '404': makeErrorResponse('Membership not found')
                }
            }
        },
        '/api/game-characters/{id}/approve': {
            post: {
                summary: 'Approve membership',
                description: 'Approve a pending membership. Only the game owner may perform this action.',
                tags: ['Game Characters'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                            format: 'uuid'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Membership approved',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/GameCharacterResponse'
                                }
                            }
                        }
                    },
                    '400': makeErrorResponse('Membership not pending'),
                    '401': makeErrorResponse('Authentication required'),
                    '404': makeErrorResponse('Membership not found')
                }
            }
        },
        '/api/game-characters/{id}/reject': {
            post: {
                summary: 'Reject membership',
                description: 'Reject a pending membership. Only the game owner may perform this action.',
                tags: ['Game Characters'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                            format: 'uuid'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Membership rejected',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/GameCharacterResponse'
                                }
                            }
                        }
                    },
                    '400': makeErrorResponse('Membership not pending'),
                    '401': makeErrorResponse('Authentication required'),
                    '404': makeErrorResponse('Membership not found')
                }
            }
        },
        '/api/game-characters/{id}/state': {
            patch: {
                summary: 'Update membership state',
                description: 'Game masters can update HP, conditions, and temporary modifiers for approved memberships.',
                tags: ['Game Characters'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                            format: 'uuid'
                        }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/GameCharacterStateUpdateRequest'
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Membership state updated',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/GameCharacterResponse'
                                }
                            }
                        }
                    },
                    '400': makeErrorResponse('Invalid payload or membership not approved'),
                    '401': makeErrorResponse('Authentication required'),
                    '404': makeErrorResponse('Membership not found')
                }
            }
        },
        '/api/dashboard': {
            get: {
                summary: 'Dashboard data',
                description: 'Aggregated data for the authenticated user: profile, characters, and owned games.',
                tags: ['Dashboard'],
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Dashboard payload',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/DashboardResponse'
                                }
                            }
                        }
                    },
                    '401': makeErrorResponse('Authentication required')
                }
            }
        },
        '/api/characters': {
            post: {
                summary: 'Create a character',
                description: 'Persist player-provided character data. The authenticated user is stored as the owner and computed fields are not persisted.',
                tags: ['Characters'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/CharacterRequest'
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Character created successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/CharacterPersistedResponse'
                                }
                            }
                        }
                    },
                    '401': makeErrorResponse('Authentication required')
                }
            },
            get: {
                summary: 'List characters',
                description: 'Return persisted character data for the authenticated user without computed fields.',
                tags: ['Characters'],
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'List of characters',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/CharacterPersisted'
                                    }
                                }
                            }
                        }
                    },
                    '401': makeErrorResponse('Authentication required')
                }
            }
        },
        '/api/characters/{id}': {
            get: {
                summary: 'Get character with computed data',
                description: 'Load character data with computed values. Accessible to the owner and to the game master of any approved game this character participates in.',
                tags: ['Characters'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                            format: 'uuid'
                        },
                        description: 'Character identifier (UUID).'
                    }
                ],
                responses: {
                    '200': {
                        description: 'Character loaded successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/CharacterComputedResponse'
                                },
                                examples: {
                                    computedCharacter: {
                                        summary: 'Character with computed block',
                                        value: {
                                            character: {
                                                id: '5b5c6c72-9f07-4e5b-8c4b-4d89f3a4b8c1',
                                                name: 'Aiko Tanaka',
                                                profession: 'Netrunner',
                                                level: 5,
                                                xp: 1200,
                                                ageReal: 27,
                                                ageApparent: 24,
                                                heightCm: 172,
                                                weightKg: 63,
                                                imageUrl: 'https://example.com/aiko.png',
                                                resources: {
                                                    hp_current: 28,
                                                    heroPoints_current: 2
                                                },
                                                attributes: [
                                                    {
                                                        id: 1,
                                                        characterId: '5b5c6c72-9f07-4e5b-8c4b-4d89f3a4b8c1',
                                                        attributeId: 'INT',
                                                        base: 7
                                                    }
                                                ],
                                                skills: [
                                                    {
                                                        id: '7cc1d071-6d41-4d52-a365-369a6a0ef1cb',
                                                        characterId: '5b5c6c72-9f07-4e5b-8c4b-4d89f3a4b8c1',
                                                        name: 'Hacking',
                                                        category: 'geral',
                                                        baseAttribute: 'INT',
                                                        invested: {
                                                            primary: 3
                                                        },
                                                        misc: 1,
                                                        damage: null,
                                                        rof: null
                                                    }
                                                ],
                                                cyberwares: [
                                                    {
                                                        id: '1d2f1e6c-f0d8-4938-9113-e5b639d3adab',
                                                        characterId: '5b5c6c72-9f07-4e5b-8c4b-4d89f3a4b8c1',
                                                        name: 'Neural Interface',
                                                        description: 'Direct deck connection.',
                                                        cost: 3,
                                                        modifiers: {
                                                            hacking: '+2'
                                                        },
                                                        skillModifiers: {}
                                                    }
                                                ],
                                                psiPowers: [],
                                                enhancements: []
                                            },
                                            computed: {
                                                derivedStats: {
                                                    initiative: 12,
                                                    hpMax: 30
                                                },
                                                notes: 'Computed exclusively by ruleEngine.'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '404': makeErrorResponse('Character not found'),
                    '401': makeErrorResponse('Authentication required')
                }
            },
            patch: {
                summary: 'Update character',
                description: 'Owners can update character data. Use game-character endpoints for per-game state changes.',
                tags: ['Characters'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                            format: 'uuid'
                        }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/CharacterRequest' }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Update applied successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/CharacterPersistedResponse' }
                            }
                        }
                    },
                    '401': makeErrorResponse('Authentication required'),
                    '404': makeErrorResponse('Character not found or not accessible')
                }
            },
            delete: {
                summary: 'Delete character',
                description: 'Remove a character and all related records. Only the owning user can perform this operation.',
                tags: ['Characters'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'string',
                            format: 'uuid'
                        }
                    }
                ],
                responses: {
                    '204': {
                        description: 'Character deleted successfully'
                    },
                    '401': makeErrorResponse('Authentication required')
                }
            }
        }
    },
    tags: [
        { name: 'Health', description: 'Endpoints used for service health checks.' },
        { name: 'Characters', description: 'Manage character resources.' },
        { name: 'Auth', description: 'User registration and authentication endpoints.' },
        { name: 'Users', description: 'Authenticated user operations.' },
        { name: 'Games', description: 'Create and manage tabletop campaigns.' },
        { name: 'Game Characters', description: 'Manage character participation in games.' },
        { name: 'Dashboard', description: 'Aggregated data for the user-facing dashboard.' }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        },
        schemas: {
            ErrorResponse: {
                type: 'object',
                required: ['error'],
                properties: {
                    error: {
                        type: 'object',
                        required: ['code', 'category', 'message', 'status', 'path', 'timestamp'],
                        properties: {
                            code: {
                                type: 'string',
                                description: 'Machine-readable error code derived from the catalog.',
                                example: 'AUTH.UNAUTHORIZED'
                            },
                            category: {
                                type: 'string',
                                description: 'High-level category describing the error domain.',
                                example: 'auth'
                            },
                            message: {
                                type: 'string',
                                description: 'Human-readable message summarizing the error.',
                                example: 'Authentication required'
                            },
                            status: {
                                type: 'integer',
                                format: 'int32',
                                description: 'HTTP status code associated with the error.',
                                example: 401
                            },
                            details: {
                                type: 'object',
                                nullable: true,
                                additionalProperties: true,
                                description: 'Optional payload for structured error details.',
                                example: null
                            },
                            context: {
                                type: 'object',
                                nullable: true,
                                additionalProperties: true,
                                description: 'Additional context the server may include for debugging.',
                                example: null
                            },
                            path: {
                                type: 'string',
                                description: 'Request path where the error occurred.',
                                example: '/api/users/me'
                            },
                            timestamp: {
                                type: 'string',
                                format: 'date-time',
                                description: 'ISO-8601 timestamp representing when the error was generated.',
                                example: '2024-01-01T12:00:00.000Z'
                            }
                        }
                    }
                }
            },
            AuthCredentials: {
                type: 'object',
                properties: {
                    email: {
                        type: 'string',
                        format: 'email',
                        description: 'User email used as login identifier.'
                    },
                    password: {
                        type: 'string',
                        format: 'password',
                        minLength: 8,
                        description: 'User password (minimum 8 characters).'
                    }
                },
                required: ['email', 'password']
            },
            User: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        format: 'uuid',
                        readOnly: true
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        readOnly: true
                    },
                    displayName: {
                        type: 'string',
                        nullable: true,
                        description: 'Optional display name for the user.'
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                        readOnly: true
                    },
                    updatedAt: {
                        type: 'string',
                        format: 'date-time',
                        readOnly: true
                    }
                }
            },
            AuthResponse: {
                type: 'object',
                properties: {
                    token: {
                        type: 'string',
                        description: 'JWT token for subsequent authenticated requests.'
                    },
                    user: {
                        $ref: '#/components/schemas/User'
                    }
                }
            },
            UserUpdateRequest: {
                type: 'object',
                description: 'Fields the authenticated user may update on their own account.',
                properties: {
                    displayName: {
                        type: 'string',
                        nullable: true,
                        description: 'Display name. Send null to clear.'
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        description: 'New email address. Must remain unique.'
                    },
                    password: {
                        type: 'string',
                        format: 'password',
                        minLength: 8,
                        description: 'New password (minimum 8 characters).'
                    }
                },
                minProperties: 1
            },
            UserResponse: {
                type: 'object',
                properties: {
                    user: {
                        $ref: '#/components/schemas/User'
                    }
                }
            },
            GameCharacterJoinRequest: {
                type: 'object',
                properties: {
                    gameId: {
                        type: 'string',
                        format: 'uuid',
                        description: 'Target game identifier.'
                    },
                    characterId: {
                        type: 'string',
                        format: 'uuid',
                        description: 'Character requesting participation.'
                    }
                },
                required: ['gameId', 'characterId']
            },
            GameCharacterStateUpdateRequest: {
                type: 'object',
                description: 'Payload used by game masters to adjust per-game state.',
                properties: {
                    hpCurrent: {
                        type: 'integer',
                        nullable: true,
                        description: 'Override for current hit points.'
                    },
                    conditions: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'List of active conditions.'
                    },
                    temporaryModifiers: {
                        type: 'object',
                        nullable: true,
                        additionalProperties: true,
                        description: 'Ad-hoc modifiers applied for the current session.'
                    }
                },
                minProperties: 1
            },
            GameCharacterMembership: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid', readOnly: true },
                    gameId: { type: 'string', format: 'uuid', readOnly: true },
                    characterId: { type: 'string', format: 'uuid', readOnly: true },
                    userId: { type: 'string', format: 'uuid', readOnly: true },
                    status: {
                        type: 'string',
                        enum: ['pending', 'approved', 'rejected'],
                        readOnly: true
                    },
                    hpCurrent: {
                        type: 'integer',
                        nullable: true,
                        description: 'Current hit points tracked within the game context.'
                    },
                    conditions: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'Active conditions applied within the game context.'
                    },
                    temporaryModifiers: {
                        type: 'object',
                        nullable: false,
                        additionalProperties: true,
                        description: 'Ad-hoc modifiers affecting the character during the game.'
                    },
                    game: {
                        type: 'object',
                        nullable: true,
                        properties: {
                            id: { type: 'string', format: 'uuid', readOnly: true },
                            name: { type: 'string', readOnly: true },
                            ownerUserId: { type: 'string', format: 'uuid', readOnly: true }
                        }
                    },
                    character: {
                        type: 'object',
                        nullable: true,
                        properties: {
                            id: { type: 'string', format: 'uuid', readOnly: true },
                            name: { type: 'string', readOnly: true },
                            userId: { type: 'string', format: 'uuid', readOnly: true }
                        }
                    },
                    createdAt: { type: 'string', format: 'date-time', readOnly: true },
                    updatedAt: { type: 'string', format: 'date-time', readOnly: true }
                }
            },
            GameCharacterResponse: {
                type: 'object',
                properties: {
                    membership: {
                        $ref: '#/components/schemas/GameCharacterMembership'
                    }
                }
            },
            GameCharacterListResponse: {
                type: 'object',
                properties: {
                    memberships: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/GameCharacterMembership' }
                    }
                }
            },
            Game: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid', readOnly: true },
                    name: { type: 'string' },
                    description: { type: 'string', nullable: true },
                    status: {
                        type: 'string',
                        enum: ['draft', 'active', 'archived']
                    },
                    ownerUserId: { type: 'string', format: 'uuid', readOnly: true },
                    createdAt: { type: 'string', format: 'date-time', readOnly: true },
                    updatedAt: { type: 'string', format: 'date-time', readOnly: true }
                }
            },
            GameRequest: {
                type: 'object',
                properties: {
                    name: { type: 'string', description: 'Game name.' },
                    description: { type: 'string', nullable: true, description: 'Narrative summary displayed to players.' },
                    status: {
                        type: 'string',
                        enum: ['draft', 'active', 'archived'],
                        description: 'Optional state for campaign lifecycle.'
                    }
                },
                required: ['name', 'description']
            },
            GameUpdateRequest: {
                type: 'object',
                description: 'Partial update payload for an existing game. Only owners may submit these changes.',
                properties: {
                    name: { type: 'string', description: 'Updated game name.' },
                    description: { type: 'string', nullable: true, description: 'Updated narrative summary.' },
                    status: {
                        type: 'string',
                        enum: ['draft', 'active', 'archived'],
                        description: 'Updated campaign lifecycle status.'
                    }
                },
                minProperties: 1
            },
            GameResponse: {
                type: 'object',
                properties: {
                    game: {
                        $ref: '#/components/schemas/Game'
                    }
                }
            },
            GamesResponse: {
                type: 'object',
                properties: {
                    games: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/Game'
                        }
                    }
                }
            },
            DashboardResponse: {
                type: 'object',
                properties: {
                    user: {
                        $ref: '#/components/schemas/User'
                    },
                    characters: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/CharacterPersisted'
                        }
                    },
                    games: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/Game'
                        }
                    }
                }
            },
            CharacterInput: {
                type: 'object',
                description: 'Player input persisted in the database.',
                properties: {
                    name: {
                        type: 'string',
                        description: 'Input: character name.'
                    },
                    profession: {
                        type: 'string',
                        description: 'Input: character profession.'
                    },
                    level: {
                        type: 'integer',
                        description: 'Input: current level.'
                    },
                    xp: {
                        type: 'integer',
                        description: 'Input: accumulated experience points.'
                    },
                    ageReal: {
                        type: 'integer',
                        description: 'Input: real age.'
                    },
                    ageApparent: {
                        type: 'integer',
                        description: 'Input: apparent age.'
                    },
                    heightCm: {
                        type: 'integer',
                        description: 'Input: height in centimeters.'
                    },
                    weightKg: {
                        type: 'integer',
                        description: 'Input: weight in kilograms.'
                    },
                    imageUrl: {
                        type: 'string',
                        nullable: true,
                        description: 'Input: portrait URL (optional).'
                    },
                    resources: {
                        type: 'object',
                        additionalProperties: true,
                        description: 'Input: current resources (hp, hero points, etc.).'
                    }
                },
                required: ['name', 'profession', 'ageReal', 'ageApparent', 'heightCm', 'weightKg']
            },
            AttributeInput: {
                type: 'object',
                description: 'Player input for character attributes.',
                properties: {
                    attributeId: {
                        type: 'string',
                        enum: ['CON', 'FOR', 'DEX', 'AGI', 'INT', 'WILL', 'PER', 'CAR'],
                        description: 'Input: attribute identifier.'
                    },
                    base: {
                        type: 'integer',
                        description: 'Input: base value.'
                    }
                },
                required: ['attributeId', 'base']
            },
            SkillInput: {
                type: 'object',
                description: 'Player input for character skills.',
                properties: {
                    name: {
                        type: 'string',
                        description: 'Input: skill name.'
                    },
                    category: {
                        type: 'string',
                        enum: ['geral', 'combate_melee', 'combate_ranged'],
                        description: 'Input: skill category.'
                    },
                    baseAttribute: {
                        type: 'string',
                        enum: ['CON', 'FOR', 'DEX', 'AGI', 'INT', 'WILL', 'PER', 'CAR'],
                        description: 'Input: linked base attribute.'
                    },
                    invested: {
                        type: 'object',
                        additionalProperties: true,
                        description: 'Input: investment payload (primary, secondary, etc.).'
                    },
                    misc: {
                        type: 'integer',
                        description: 'Input: miscellaneous modifiers.'
                    },
                    damage: {
                        type: 'string',
                        nullable: true,
                        description: 'Input: damage expression (optional).'
                    },
                    rof: {
                        type: 'integer',
                        nullable: true,
                        description: 'Input: rate of fire (optional).'
                    }
                },
                required: ['name', 'category', 'baseAttribute']
            },
            CyberwareInput: {
                type: 'object',
                description: 'Player input for cyberware items.',
                properties: {
                    name: { type: 'string', description: 'Input: cyberware name.' },
                    description: { type: 'string', description: 'Input: cyberware description.' },
                    cost: { type: 'integer', description: 'Input: activation or maintenance cost.' },
                    modifiers: {
                        type: 'object',
                        additionalProperties: true,
                        description: 'Input: generic modifiers contributed by the item.'
                    },
                    skillModifiers: {
                        type: 'object',
                        additionalProperties: true,
                        description: 'Input: skill-specific modifiers.'
                    }
                },
                required: ['name', 'description', 'cost']
            },
            PsiPowerInput: {
                type: 'object',
                description: 'Player input for psi powers.',
                properties: {
                    name: { type: 'string', description: 'Input: psi power name.' },
                    notes: { type: 'string', description: 'Input: descriptive notes.' },
                    focus: { type: 'integer', description: 'Input: focus cost.' }
                },
                required: ['name', 'notes', 'focus']
            },
            EnhancementInput: {
                type: 'object',
                description: 'Player input for enhancements.',
                properties: {
                    type: {
                        type: 'string',
                        enum: ['cyberware', 'psi', 'heroic'],
                        description: 'Input: enhancement type.'
                    },
                    cost: { type: 'integer', description: 'Input: cost value.' },
                    description: { type: 'string', description: 'Input: enhancement description.' }
                },
                required: ['type', 'cost', 'description']
            },
            CharacterRequest: {
                type: 'object',
                properties: {
                    character: { $ref: '#/components/schemas/CharacterInput' },
                    attributes: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/AttributeInput' }
                    },
                    skills: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/SkillInput' }
                    },
                    cyberwares: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/CyberwareInput' }
                    },
                    psiPowers: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/PsiPowerInput' }
                    },
                    enhancements: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/EnhancementInput' }
                    }
                },
                required: ['character']
            },
            AttributePersisted: {
                allOf: [
                    { $ref: '#/components/schemas/AttributeInput' },
                    {
                        type: 'object',
                        properties: {
                            id: { type: 'integer', readOnly: true },
                            characterId: { type: 'string', format: 'uuid', readOnly: true }
                        }
                    }
                ]
            },
            SkillPersisted: {
                allOf: [
                    { $ref: '#/components/schemas/SkillInput' },
                    {
                        type: 'object',
                        properties: {
                            id: { type: 'string', format: 'uuid', readOnly: true },
                            characterId: { type: 'string', format: 'uuid', readOnly: true }
                        }
                    }
                ]
            },
            CyberwarePersisted: {
                allOf: [
                    { $ref: '#/components/schemas/CyberwareInput' },
                    {
                        type: 'object',
                        properties: {
                            id: { type: 'string', format: 'uuid', readOnly: true },
                            characterId: { type: 'string', format: 'uuid', readOnly: true }
                        }
                    }
                ]
            },
            PsiPowerPersisted: {
                allOf: [
                    { $ref: '#/components/schemas/PsiPowerInput' },
                    {
                        type: 'object',
                        properties: {
                            id: { type: 'string', format: 'uuid', readOnly: true },
                            characterId: { type: 'string', format: 'uuid', readOnly: true }
                        }
                    }
                ]
            },
            EnhancementPersisted: {
                allOf: [
                    { $ref: '#/components/schemas/EnhancementInput' },
                    {
                        type: 'object',
                        properties: {
                            id: { type: 'string', format: 'uuid', readOnly: true },
                            characterId: { type: 'string', format: 'uuid', readOnly: true }
                        }
                    }
                ]
            },
            CharacterPersisted: {
                allOf: [
                    {
                        type: 'object',
                        properties: {
                            id: { type: 'string', format: 'uuid', readOnly: true },
                            userId: { type: 'string', format: 'uuid', readOnly: true },
                            createdAt: { type: 'string', format: 'date-time', readOnly: true },
                            updatedAt: { type: 'string', format: 'date-time', readOnly: true }
                        }
                    },
                    {
                        $ref: '#/components/schemas/CharacterInput'
                    }
                ],
                properties: {
                    attributes: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/AttributePersisted' },
                        description: 'Read-only: persisted attributes.'
                    },
                    skills: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/SkillPersisted' },
                        description: 'Read-only: persisted skills.'
                    },
                    cyberwares: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/CyberwarePersisted' },
                        description: 'Read-only: persisted cyberware.'
                    },
                    psiPowers: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/PsiPowerPersisted' },
                        description: 'Read-only: persisted psi powers.'
                    },
                    enhancements: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/EnhancementPersisted' },
                        description: 'Read-only: persisted enhancements.'
                    },
                    gameMemberships: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/GameCharacterMembership' },
                        description: 'Read-only: per-game participation state.'
                    }
                }
            },
            CharacterPersistedResponse: {
                type: 'object',
                properties: {
                    character: {
                        $ref: '#/components/schemas/CharacterPersisted'
                    }
                }
            },
            ComputedCharacter: {
                type: 'object',
                description: 'Read-only block returned by ruleEngine. The structure depends on external rules.',
                additionalProperties: true
            },
            CharacterComputedResponse: {
                type: 'object',
                properties: {
                    character: {
                        $ref: '#/components/schemas/CharacterPersisted'
                    },
                    computed: {
                        $ref: '#/components/schemas/ComputedCharacter'
                    }
                }
            }
        }
    }
};
exports.default = swaggerDocument;
