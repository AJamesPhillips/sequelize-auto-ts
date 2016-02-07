////////////////////////////////////////////////////////////////////
//
// GENERATED CLASS
//
// DO NOT EDIT
//
// See sequelize-auto-ts for edits
//
////////////////////////////////////////////////////////////////////

/// <reference path="../typings/tsd.d.ts" />

import Sequelize = require('sequelize');
import types = require('./sequelize-types');

export var initialized:boolean = false;
export var SEQUELIZE:Sequelize.Sequelize;

/*__each__ tables */ export var __modelTypeName__:types.__modelTypeName__;

/*__ignore__*/ var __defineFieldType__;
/*__ignore__*/ var __primaryTableModelName__:Sequelize.Model<any, any>;
/*__ignore__*/ var __foreignTableModelName__:Sequelize.Model<any, any>;
/*__ignore__*/ var __firstTableModelName__:Sequelize.Model<any, any>;
/*__ignore__*/ var __secondTableModelName__:Sequelize.Model<any, any>;
/*__ignore__*/ var __associationNameQuoted__:string;

export function initialize(database:string, username:string, password:string, options:Sequelize.Options):any
{
    if (initialized)
    {
        return;
    }

    SEQUELIZE = new Sequelize(database, username, password, options);

    /*__startEach__ tables */

    __modelTypeName__ = <types.__modelTypeName__> SEQUELIZE.define<types.__instanceTypeName__, types.__pojoName__>('__tableNameSingular__', {
        /*__each__ realDbFields, */'__fieldName__': __defineFieldType__
        },
        {
            classMethods: {
                __getterName__:(__tableNameSingularCamel__:any) => {
                    var where:{[key:string]:any} = {};
                    var id:number = parseInt(__tableNameSingularCamel__);
                    if (isNaN(id)) {
                        /*__each__ realDbFields */ if (__tableNameSingularCamel__['__fieldName__'] !== undefined) { where['__fieldName__'] = __tableNameSingularCamel__['__fieldName__']}
                    } else {
                        where['__idFieldName__'] = id;
                    }
                    return __modelTypeName__.find({where: where});
                }
            }
        });
    /*__endEach__*/

    /*__startEach__ references */

    __primaryTableModelName__.hasMany(__foreignTableModelName__, {foreignKey: '__foreignKey__' });
    __foreignTableModelName__.belongsTo(__primaryTableModelName__, {as: __associationNameQuoted__, foreignKey: '__foreignKey__' });

    /*__endEach__*/

    /*__startEach__ xrefs */

    __firstTableModelName__.belongsToMany(__secondTableModelName__, { through: '__xrefTableName__'});
    __secondTableModelName__.belongsToMany(__firstTableModelName__, { through: '__xrefTableName__'});

    /*__endEach__*/

    return exports;
}
