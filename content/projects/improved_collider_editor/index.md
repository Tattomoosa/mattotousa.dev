+++
title="Improved Collider Editor"
weight=21
[taxonomies]
language=["Unity3d", "C#"]
[extra]
lead="Unity collider editing, but better"
+++

This is a [Unity3D](https://unity3d.com) asset that makes editing Unity's
built-in colliders easier.
I built it because I got really annoyed that you can control a
collider's center and extants, but not pull only one side out.

Colliders, of course, are physics simplifications, at least the primitives.
This means they do have some limitations.
For instance, there are no real oval-shaped spheroid colliders, just
the Sphere and the Capsule - two hemispheres connected by a cylinder.
These simplifications assist in letting physics engines do really
efficient calculations, even involving many many objects.

So, in Unity, only the values you can adjust "in-code" are user editable. This means a box collider, for instance, has a field `center` and a field `bounds`.
If you want to extend only one side out, you have to actually pull the bounds and change the center in order to accomplish that.

<todo>PICTURES TO ILLUSTRATE WOULD BE GOOD</todo>
