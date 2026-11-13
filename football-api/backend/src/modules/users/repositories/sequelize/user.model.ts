
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({ tableName: 'users', timestamps: false })
export class UserModel extends Model<
  UserModel,
  { email: string; passwordHash: string }
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    field: 'password_hash',
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare passwordHash: string;
}
