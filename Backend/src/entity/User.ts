import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  location: string | null;
  blog: string | null;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
  public_gists: number;
  company: string | null;
  email: string | null;
  hireable: boolean | null;
  twitter_username: string | null;
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    username!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    name!: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    location!: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    blog!: string | null;

    @Column({ type: 'text', nullable: true })
    bio!: string | null;

    @Column({ type: 'int', default: 0 })
    followers!: number;

    @Column({ type: 'int', default: 0 })
    following!: number;

    @Column({ type: 'int', default: 0 })
    public_repos!: number;

    @Column({ type: 'int', default: 0 })
    public_gists!: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    avatar_url!: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    html_url!: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    company!: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    email!: string | null;

    @Column({ type: 'tinyint', default: 0 })
    hireable!: boolean;

    @Column({ type: 'varchar', length: 255, nullable: true })
    twitter_username!: string | null;

    @Column({ type: 'tinyint', default: 1 })
    isActive!: boolean;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}
