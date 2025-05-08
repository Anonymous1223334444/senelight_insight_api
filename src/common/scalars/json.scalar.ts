import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('JSON', () => Object)
export class JSONScalar implements CustomScalar<any, any> {
  description = 'JSON custom scalar type';

  parseValue(value: any): any {
    return value;
  }

  serialize(value: any): any {
    return value;
  }

  parseLiteral(ast: ValueNode): any {
    if (ast.kind === Kind.OBJECT) {
      return this.parseObject(ast);
    } else if (ast.kind === Kind.LIST) {
      return this.parseList(ast);
    } else {
      return this.parseScalar(ast);
    }
  }

  private parseObject(ast: any): any {
    const value = Object.create(null);
    ast.fields.forEach((field: any) => {
      value[field.name.value] = this.parseLiteral(field.value);
    });
    return value;
  }

  private parseList(ast: any): any {
    return ast.values.map((value: any) => this.parseLiteral(value));
  }

  private parseScalar(ast: any): any {
    switch (ast.kind) {
      case Kind.STRING:
        return ast.value;
      case Kind.BOOLEAN:
        return ast.value === 'true';
      case Kind.INT:
      case Kind.FLOAT:
        return Number(ast.value);
      default:
        return null;
    }
  }
}