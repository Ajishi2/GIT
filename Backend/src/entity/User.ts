import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

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
@Unique(["username"])  // Ensure username is unique
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  username!: string; // username will be unique

  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  blog?: string | null;

  @Column({ type: 'text', nullable: true })
  bio?: string | null;

  @Column({ type: 'int', default: 0 })
  followers!: number;

  @Column({ type: 'int', default: 0 })
  following!: number;

  @Column({ type: 'int', default: 0 })
  public_repos!: number;

  @Column({ type: 'int', default: 0 })
  public_gists!: number;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string | null;
  
  @Column({ type: 'varchar', length: 255, nullable: true })
  company?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string | null;

  @Column({ type: 'boolean', nullable: true })
  hireable?: boolean | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar_url?: string;  // Fixed indentation issue here

  @Column({ type: 'varchar', length: 255, nullable: true })
  twitter_username?: string | null;
}
